document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  const result = await chrome.storage.local.get(['settings']);
  const settings = result.settings || {
    apiKeys: { openai: '', gemini: '', groq: '' },
    enableCache: true,
    autoDetectLanguage: true
  };

  document.getElementById('openaiKey').value = settings.apiKeys.openai;
  document.getElementById('geminiKey').value = settings.apiKeys.gemini;
  document.getElementById('groqKey').value = settings.apiKeys.groq;
  document.getElementById('enableCache').checked = settings.enableCache;
  document.getElementById('autoDetect').checked = settings.autoDetectLanguage;

  // Save settings
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const latest = await chrome.storage.local.get(['settings']);
    const currentSettings = latest.settings || {};

    const newSettings = {
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
    alert('Configurações salvas!');
  });
});
