const PROVIDERS = {
  openai: self.translateWithOpenAI,
  gemini: self.translateWithGemini,
  groq: self.translateWithGroq
};

self.listProviderModels = async function(provider, apiKey) {
  if (!PROVIDERS[provider]) throw new Error('Provedor inválido.');
  if (!apiKey || !apiKey.trim()) throw new Error('Informe uma chave de API válida.');

  const endpoints = {
    openai: 'https://api.openai.com/v1/models',
    gemini: `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`,
    groq: 'https://api.groq.com/openai/v1/models'
  };
  const headers = provider === 'gemini'
    ? {}
    : { Authorization: `Bearer ${apiKey.trim()}` };
  const response = await fetch(endpoints[provider], { headers });
  const data = await response.json();

  if (!response.ok) {
    const message = data.error?.message || data.error?.type || `HTTP ${response.status}`;
    throw new Error(`Falha ao consultar modelos: ${message}`);
  }

  let models = (data.data || data.models || []).map(model => {
    const id = model.id || model.name || '';
    return id.replace(/^models\//, '');
  });

  if (provider === 'openai') {
    models = models.filter(model => /^gpt-/i.test(model) && !/(audio|realtime|transcribe|tts|image|embedding|moderation)/i.test(model));
  } else if (provider === 'gemini') {
    models = (data.models || [])
      .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
      .map(model => model.name.replace(/^models\//, ''));
  } else {
    models = models.filter(model => !/(whisper|guard|embedding|safeguard)/i.test(model));
  }

  if (!models.length) throw new Error('A API não retornou modelos de geração de texto disponíveis.');
  return [...new Set(models)].sort();
};

self.translateText = async function(text, sourceLang, targetLang) {
  const settings = await self.getSettings();
  const normalizedText = self.normalizeText(text);

  if (settings.enableCache) {
    const cached = await self.getFromCache(sourceLang, targetLang, normalizedText);
    if (cached) {
      self.logger.info('Cache hit');
      return cached;
    }
  }

  // Check if any API keys are set
  const hasAnyKey = Object.values(settings.apiKeys).some(key => key && key.trim() !== '');
  
  if (!hasAnyKey) {
    self.logger.warn('No API keys set! Using test translation.');
    // Test translation for demo purposes
    const testTranslations = {
      'pt-en': {
        'Olá! tudo bem': 'Hello! how are you',
        'Olá!': 'Hello!'
      },
      'en-pt': {
        'Hello!': 'Olá!',
        'Hello! how are you': 'Olá! tudo bem'
      }
    };
    
    const key = `${sourceLang}-${targetLang}`;
    if (testTranslations[key] && testTranslations[key][text]) {
      return testTranslations[key][text];
    }
    
    // Fallback test translation
    return `[TRADUÇÃO TESTE] ${text}`;
  }

  const errors = [];
  for (const providerName of settings.fallbackOrder) {
    let apiKey = settings.apiKeys[providerName];
    if (apiKey) apiKey = apiKey.trim();
    if (!apiKey) continue;

    const model = settings.selectedModels[providerName];
    if (!model) {
      errors.push(`${providerName}: Selecione um modelo nas configurações`);
      continue;
    }

    try {
      const timeout = settings.providerTimeouts[providerName];
      self.logger.info(`Trying ${providerName}...`);
      const translation = await PROVIDERS[providerName](
        text,
        sourceLang,
        targetLang,
        apiKey,
        timeout,
        model
      );

      if (settings.enableCache) {
        await self.saveToCache(sourceLang, targetLang, normalizedText, translation);
      }

      return translation;
    } catch (error) {
      self.logger.warn(`${providerName} failed:`, error);
      errors.push(`${providerName} falhou: ${error.message || error}`);
    }
  }

  throw new Error(`Falha em todos os provedores:\n- ${errors.join('\n- ')}`);
};
