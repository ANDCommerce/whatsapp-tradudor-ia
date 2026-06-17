const DEBUG_MODE = false;

self.logger = {
  info: (...args) => {
    if (DEBUG_MODE) console.log('[WhatsApp Translator]', ...args);
  },
  error: (...args) => console.error('[WhatsApp Translator]', ...args),
  warn: (...args) => console.warn('[WhatsApp Translator]', ...args)
};
