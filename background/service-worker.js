importScripts(
  '../utils/constants.js',
  '../utils/logger.js',
  '../utils/language-detector.js',
  '../storage/settings.js',
  '../storage/cache.js',
  './providers/openai.js',
  './providers/gemini.js',
  './providers/groq.js',
  './ai-manager.js'
);

chrome.runtime.onInstalled.addListener(async (details) => {
  self.logger.info('Extension installed/reloaded!', details.reason);
  await cleanExpiredCache();
  
  // Refresh all WhatsApp Web tabs when extension is reloaded
  if (details.reason === 'update' || details.reason === 'install') {
    const whatsappTabs = await chrome.tabs.query({ url: 'https://web.whatsapp.com/*' });
    for (const tab of whatsappTabs) {
      await chrome.tabs.reload(tab.id);
      self.logger.info('Reloaded WhatsApp tab:', tab.id);
    }
  }
});

chrome.alarms.create('cleanCache', { periodInMinutes: 60 * 24 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanCache') {
    cleanExpiredCache();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    self.logger.info('Background service received translate request:', {
      text: request.text.substring(0, 50),
      sourceLang: request.sourceLang,
      targetLang: request.targetLang
    });
    
    self.translateText(request.text, request.sourceLang, request.targetLang)
      .then((translation) => {
        self.logger.info('Translation successful:', translation);
        sendResponse({ success: true, translation });
      })
      .catch((error) => {
        self.logger.error('Translation failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});
