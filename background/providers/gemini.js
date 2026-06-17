self.translateWithGemini = async function(text, sourceLang, targetLang, apiKey, timeout) {
  const prompt = self.buildTranslationPrompt(text, sourceLang, targetLang);

  const models = [
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.1-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
    'gemini-pro'
  ];

  let lastError = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
      ];

      for (const url of endpoints) {
        try {
          self.logger.info(`Trying Gemini model ${model} at ${url.includes('/v1/') ? 'v1' : 'v1beta'}...`);
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }]
              }]
            }),
            signal: controller.signal
          });

          if (response.ok) {
            clearTimeout(timeoutId);
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
              return data.candidates[0].content.parts[0].text.trim();
            }
          }
          
          if (response.status === 404) {
            continue;
          }
          
          throw new Error(`Gemini API error: ${response.status}`);
        } catch (err) {
          if (err.message.includes('404')) {
            continue;
          }
          throw err;
        }
      }
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      self.logger.warn(`Gemini model ${model} failed:`, error);
      if (error.message.includes('400') || error.message.includes('403')) {
        // Key is invalid or bad config, fail immediately
        throw error;
      }
    }
  }

  throw lastError || new Error('Gemini API returned 404 for all models.');
};
