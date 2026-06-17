const PROVIDERS = {
  openai: self.translateWithOpenAI,
  gemini: self.translateWithGemini,
  groq: self.translateWithGroq
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

  let errors = [];
  for (const providerName of settings.fallbackOrder) {
    let apiKey = settings.apiKeys[providerName];
    if (apiKey) apiKey = apiKey.trim();
    if (!apiKey || apiKey === '') {
      errors.push(`${providerName}: Nenhuma chave de API configurada`);
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
        timeout
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
