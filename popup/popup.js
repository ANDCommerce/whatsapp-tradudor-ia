document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  const result = await chrome.storage.local.get(['settings']);
  const savedSettings = result.settings || {};
  
  // Safe default merges to prevent TypeErrors when sub-properties are missing
  const apiKeys = { openai: '', gemini: '', groq: '', ...(savedSettings.apiKeys || {}) };
  const selectedModels = { openai: '', gemini: '', groq: '', ...(savedSettings.selectedModels || {}) };
  const modelCatalog = { openai: [], gemini: [], groq: [], ...(savedSettings.modelCatalog || {}) };
  const enableCache = savedSettings.enableCache !== undefined ? savedSettings.enableCache : true;
  const autoDetectLanguage = savedSettings.autoDetectLanguage !== undefined ? savedSettings.autoDetectLanguage : true;

  document.getElementById('openaiKey').value = apiKeys.openai;
  document.getElementById('geminiKey').value = apiKeys.gemini;
  document.getElementById('groqKey').value = apiKeys.groq;
  for (const provider of Object.keys(apiKeys)) {
    renderModels(provider, modelCatalog[provider], selectedModels[provider]);
  }
  document.getElementById('enableCache').checked = enableCache;
  document.getElementById('autoDetect').checked = autoDetectLanguage;

  document.querySelectorAll('.load-models').forEach(button => {
    button.addEventListener('click', async () => {
      const provider = button.dataset.provider;
      const apiKey = document.getElementById(`${provider}Key`).value.trim();
      const status = document.getElementById(`${provider}ModelStatus`);
      if (!apiKey) {
        status.textContent = 'Informe a chave da API.';
        return;
      }

      button.disabled = true;
      status.textContent = 'Consultando modelos...';
      try {
        const response = await chrome.runtime.sendMessage({ action: 'listModels', provider, apiKey });
        if (!response?.success) throw new Error(response?.error || 'Não foi possível carregar os modelos.');
        renderModels(provider, response.models, selectedModels[provider]);
        modelCatalog[provider] = response.models;
        status.textContent = `${response.models.length} modelos disponíveis.`;
      } catch (error) {
        status.textContent = error.message;
      } finally {
        button.disabled = false;
      }
    });
  });

  // Save settings
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const latest = await chrome.storage.local.get(['settings']);
    const currentSettings = latest.settings || {};

    const newSettings = {
      fallbackOrder: ['openai', 'gemini', 'groq'],
      providerTimeouts: { openai: 10000, gemini: 10000, groq: 10000 },
      ...currentSettings,
      apiKeys: {
        openai: document.getElementById('openaiKey').value.trim(),
        gemini: document.getElementById('geminiKey').value.trim(),
        groq: document.getElementById('groqKey').value.trim()
      },
      selectedModels: {
        openai: document.getElementById('openaiModel').value,
        gemini: document.getElementById('geminiModel').value,
        groq: document.getElementById('groqModel').value
      },
      modelCatalog,
      enableCache: document.getElementById('enableCache').checked,
      autoDetectLanguage: document.getElementById('autoDetect').checked,
      chatSettings: currentSettings.chatSettings || {}
    };

    await chrome.storage.local.set({ settings: newSettings });
    
    // Show premium sliding success toast
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  });
});

function renderModels(provider, models, selectedModel) {
  const select = document.getElementById(`${provider}Model`);
  select.replaceChildren();
  if (!models?.length) {
    select.add(new Option('Informe a chave e carregue os modelos', ''));
    select.disabled = true;
    return;
  }

  select.add(new Option('Selecione um modelo', ''));
  models.forEach(model => select.add(new Option(model, model)));
  select.value = models.includes(selectedModel) ? selectedModel : '';
  select.disabled = false;
}
