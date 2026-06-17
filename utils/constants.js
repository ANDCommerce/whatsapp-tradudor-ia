self.LANGUAGES = [
  { code: 'af', name: 'Africâner' },
  { code: 'de', name: 'Alemão' },
  { code: 'ar', name: 'Árabe' },
  { code: 'zh', name: 'Chinês' },
  { code: 'ko', name: 'Coreano' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'nl', name: 'Holandês' },
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'Inglês' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: 'Japonês' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Russo' },
  { code: 'tr', name: 'Turco' },
  { code: 'vi', name: 'Vietnamita' }
];

self.WHATSAPP_SELECTORS = {
  HEADER: 'header',
  MESSAGE_CONTAINER: 'div[role="row"]',
  MESSAGE_IN: 'div.message-in',
  MESSAGE_OUT: 'div.message-out',
  INPUT_FIELD: 'div[contenteditable="true"]'
};

self.PRIMARY_COLOR = '#46459C';

self.getLanguageName = function(code) {
  const lang = self.LANGUAGES.find((l) => l.code === code);
  return lang ? lang.name : code;
};

self.buildTranslationPrompt = function(text, sourceLang, targetLang) {
  const sourceName = self.getLanguageName(sourceLang);
  const targetName = self.getLanguageName(targetLang);

  return `Você é um tradutor profissional.

Traduza o texto de ${sourceName} (${sourceLang}) para ${targetName} (${targetLang}).

Regras:
1. Retorne APENAS a tradução final no idioma de destino (${targetName}).
2. Não explique, não adicione prefixos nem aspas.
3. Não altere o significado.
4. Preserve emojis.
5. Preserve URLs.
6. Preserve formatação e quebras de linha.

Texto:
${text}`;
};
