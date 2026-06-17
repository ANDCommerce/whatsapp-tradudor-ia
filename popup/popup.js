document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  const result = await chrome.storage.local.get(['settings']);
  const savedSettings = result.settings || {};
  
  // Safe default merges to prevent TypeErrors when sub-properties are missing
  const apiKeys = { openai: '', gemini: '', groq: '', ...(savedSettings.apiKeys || {}) };
  const enableCache = savedSettings.enableCache !== undefined ? savedSettings.enableCache : true;
  const autoDetectLanguage = savedSettings.autoDetectLanguage !== undefined ? savedSettings.autoDetectLanguage : true;

  document.getElementById('openaiKey').value = apiKeys.openai;
  document.getElementById('geminiKey').value = apiKeys.gemini;
  document.getElementById('groqKey').value = apiKeys.groq;
  document.getElementById('enableCache').checked = enableCache;
  document.getElementById('autoDetect').checked = autoDetectLanguage;

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
