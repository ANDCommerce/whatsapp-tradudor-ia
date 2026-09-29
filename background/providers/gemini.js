self.translateWithGemini = async function(text, sourceLang, targetLang, apiKey, timeout, model) {
  const prompt = self.buildTranslationPrompt(text, sourceLang, targetLang);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Gemini API error: ${response.status}`);
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!translation) throw new Error('Gemini não retornou uma tradução.');
    return translation.trim();
  } finally {
    clearTimeout(timeoutId);
  }
};
