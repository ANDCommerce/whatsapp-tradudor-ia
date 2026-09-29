self.translateWithGroq = async function(text, sourceLang, targetLang, apiKey, timeout, model) {
  const prompt = self.buildTranslationPrompt(text, sourceLang, targetLang);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.3 }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Groq API error: ${response.status}`);
    const translation = data.choices?.[0]?.message?.content;
    if (!translation) throw new Error('Groq não retornou uma tradução.');
    return translation.trim();
  } finally {
    clearTimeout(timeoutId);
  }
};
