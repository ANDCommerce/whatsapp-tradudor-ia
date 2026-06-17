self.translateWithGroq = async function(text, sourceLang, targetLang, apiKey, timeout) {
  const prompt = self.buildTranslationPrompt(text, sourceLang, targetLang);

  const models = [
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ];

  let lastError = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      self.logger.info(`Trying Groq model ${model}...`);
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }

      if (response.status === 404 || response.status === 400) {
        continue;
      }

      throw new Error(`Groq API error: ${response.status}`);
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      self.logger.warn(`Groq model ${model} failed:`, error);
      if (error.message.includes('401')) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Groq API failed for all models.');
};
