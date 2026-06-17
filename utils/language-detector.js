self.detectLanguage = function(text) {
  return new Promise((resolve) => {
    resolve({ language: 'en', confidence: 0.9 });
  });
};

self.normalizeText = function(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
};
