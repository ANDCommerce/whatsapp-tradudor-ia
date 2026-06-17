const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

self.getFromCache = async function(sourceLang, targetLang, text) {
  const key = `${sourceLang}:${targetLang}:${text}`;
  const result = await chrome.storage.local.get(['translationCache']);
  const cache = result.translationCache || {};
  const entry = cache[key];
  
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.translation;
  }
  return null;
};

self.saveToCache = async function(sourceLang, targetLang, text, translation) {
  const key = `${sourceLang}:${targetLang}:${text}`;
  const result = await chrome.storage.local.get(['translationCache']);
  const cache = result.translationCache || {};
  cache[key] = { translation, timestamp: Date.now() };
  await chrome.storage.local.set({ translationCache: cache });
};

self.cleanExpiredCache = async function() {
  const result = await chrome.storage.local.get(['translationCache']);
  const cache = result.translationCache || {};
  const now = Date.now();
  const newCache = {};
  
  for (const key in cache) {
    if (now - cache[key].timestamp < CACHE_TTL_MS) {
      newCache[key] = cache[key];
    }
  }
  
  await chrome.storage.local.set({ translationCache: newCache });
};
