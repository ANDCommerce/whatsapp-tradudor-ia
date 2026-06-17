const DEFAULT_SETTINGS = {
  apiKeys: {
    openai: '',
    gemini: '',
    groq: ''
  },
  fallbackOrder: ['openai', 'gemini', 'groq'],
  providerTimeouts: {
    openai: 10000,
    gemini: 10000,
    groq: 10000
  },
  chatSettings: {},
  enableCache: true,
  autoDetectLanguage: true
};

self.getSettings = async function() {
  const result = await chrome.storage.local.get(['settings']);
  return { ...DEFAULT_SETTINGS, ...result.settings };
};

self.saveSettings = async function(settings) {
  await chrome.storage.local.set({ settings });
};

self.getChatSettings = async function(chatId) {
  const settings = await self.getSettings();
  return settings.chatSettings[chatId] || {
    enabled: false,
    sourceLanguage: 'en',
    targetLanguage: 'pt',
    autoTranslate: false
  };
};

self.saveChatSettings = async function(chatId, chatSettings) {
  const settings = await self.getSettings();
  settings.chatSettings[chatId] = chatSettings;
  await self.saveSettings(settings);
};
