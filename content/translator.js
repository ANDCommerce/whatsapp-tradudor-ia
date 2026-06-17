// Translator UI and logic

// Default chat settings
const DEFAULT_CHAT_SETTINGS = {
  enabled: false,
  sourceLanguage: 'en',
  targetLanguage: 'pt',
  autoTranslate: false
};

let currentChatSettings = { ...DEFAULT_CHAT_SETTINGS };
let currentChatId = null;

// Chat settings dropdown
function createSettingsDropdown() {
  // Check if dropdown already exists
  if (document.getElementById('wa-translator-dropdown')) {
    return document.getElementById('wa-translator-dropdown');
  }

  // Create dropdown element
  const dropdown = document.createElement('div');
  dropdown.id = 'wa-translator-dropdown';
  dropdown.className = 'wa-translator-dropdown';
  dropdown.innerHTML = `
    <div class="wa-translator-dropdown-content">
      <h3>Configurações de Tradução</h3>
      
      <div class="wa-translator-switch-group">
        <span class="wa-translator-switch-label">Habilitar tradução nesta conversa</span>
        <label class="wa-translator-switch">
          <input type="checkbox" id="wa-translator-enabled">
          <span class="wa-translator-slider"></span>
        </label>
      </div>

      <div class="wa-translator-select-group">
        <label for="wa-translator-source-lang">Idioma do contato</label>
        <div class="wa-translator-input-group">
          <span class="wa-translator-input-group-text" title="Idioma recebido">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </span>
          <select id="wa-translator-source-lang"></select>
        </div>
      </div>

      <div class="wa-translator-select-group">
        <label for="wa-translator-target-lang">Meu idioma</label>
        <div class="wa-translator-input-group">
          <span class="wa-translator-input-group-text" title="Traduzir para">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 14.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"/>
            </svg>
          </span>
          <select id="wa-translator-target-lang"></select>
        </div>
      </div>

      <div class="wa-translator-switch-group" style="margin-top: 18px; margin-bottom: 0;">
        <span class="wa-translator-switch-label">Traduzir mensagens automaticamente</span>
        <label class="wa-translator-switch">
          <input type="checkbox" id="wa-translator-auto-translate">
          <span class="wa-translator-slider"></span>
        </label>
      </div>
    </div>
  `;

  document.body.appendChild(dropdown);
  populateLanguageSelects();
  attachSettingsListeners();
  return dropdown;
}

// Populate language selects
function populateLanguageSelects() {
  const sourceSelect = document.getElementById('wa-translator-source-lang');
  const targetSelect = document.getElementById('wa-translator-target-lang');
  if (!sourceSelect || !targetSelect) return;

  const languages = [
    { code: 'en', name: 'Inglês' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Alemão' },
    { code: 'ar', name: 'Árabe' },
    { code: 'eu', name: 'Basco' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bg', name: 'Búlgaro' },
    { code: 'ca', name: 'Catalão' },
    { code: 'zh', name: 'Chinês' },
    { code: 'ko', name: 'Coreano' },
    { code: 'hr', name: 'Croata' },
    { code: 'ku', name: 'Curdo' },
    { code: 'da', name: 'Dinamarquês' },
    { code: 'sk', name: 'Eslovaco' },
    { code: 'es', name: 'Espanhol' },
    { code: 'tl', name: 'Filipino' },
    { code: 'fi', name: 'Finlandês' },
    { code: 'fr', name: 'Francês' },
    { code: 'gl', name: 'Galego' },
    { code: 'el', name: 'Grego' },
    { code: 'gu', name: 'Guzerate' },
    { code: 'he', name: 'Hebraico' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Holandês' },
    { code: 'hu', name: 'Húngaro' },
    { code: 'id', name: 'Indonésio' },
    { code: 'ga', name: 'Irlandês' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: 'Japonês' },
    { code: 'la', name: 'Latim' },
    { code: 'ms', name: 'Malaio' },
    { code: 'mr', name: 'Marati' },
    { code: 'no', name: 'Norueguês' },
    { code: 'pa', name: 'Panjabi' },
    { code: 'ps', name: 'Pashto' },
    { code: 'fa', name: 'Persa' },
    { code: 'pl', name: 'Polonês' },
    { code: 'ro', name: 'Romeno' },
    { code: 'ru', name: 'Russo' },
    { code: 'sr', name: 'Sérvio' },
    { code: 'sd', name: 'Sindi' },
    { code: 'sw', name: 'Suaíli' },
    { code: 'sv', name: 'Sueco' },
    { code: 'th', name: 'Tailandês' },
    { code: 'ta', name: 'Tâmil' },
    { code: 'cs', name: 'Tcheco' },
    { code: 'te', name: 'Télugo' },
    { code: 'tr', name: 'Turco' },
    { code: 'uk', name: 'Ucraniano' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamita' }
  ];

  languages.forEach(lang => {
    const option1 = document.createElement('option');
    option1.value = lang.code;
    option1.textContent = lang.name;
    sourceSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = lang.code;
    option2.textContent = lang.name;
    targetSelect.appendChild(option2);
  });
}

// Attach listeners to settings fields
function attachSettingsListeners() {
  const fields = [
    'wa-translator-enabled',
    'wa-translator-source-lang',
    'wa-translator-target-lang',
    'wa-translator-auto-translate'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', saveCurrentChatSettings);
    }
  });
}

// Get current chat ID — definido em content/chat-id.js

// Load settings for current chat
async function loadCurrentChatSettings() {
  const chatId = getCurrentChatId();
  if (!chatId) {
    self.logger.info('Chat ID não detectado — configurações não carregadas (inicialização)');
    return;
  }

  currentChatId = chatId;
  
  const result = await chrome.storage.local.get(['settings']);
  const allSettings = result.settings || {};
  currentChatSettings = allSettings.chatSettings?.[chatId] || { ...DEFAULT_CHAT_SETTINGS };

  // Update UI (se dropdown já existir)
  const enabledCheckbox = document.getElementById('wa-translator-enabled');
  const sourceSelect = document.getElementById('wa-translator-source-lang');
  const targetSelect = document.getElementById('wa-translator-target-lang');
  const autoTranslateCheckbox = document.getElementById('wa-translator-auto-translate');

  if (enabledCheckbox) enabledCheckbox.checked = currentChatSettings.enabled;
  if (sourceSelect) sourceSelect.value = currentChatSettings.sourceLanguage;
  if (targetSelect) targetSelect.value = currentChatSettings.targetLanguage;
  if (autoTranslateCheckbox) autoTranslateCheckbox.checked = currentChatSettings.autoTranslate;
  
  self.logger.info('Chat settings loaded!', { chatId, settings: currentChatSettings });
}

// Save settings for current chat
async function saveCurrentChatSettings() {
  const chatId = getCurrentChatId();
  if (!chatId) {
    self.logger.info('Chat ID não detectado — configurações não salvas (sem conversa aberta)');
    return;
  }

  self.logger.info('Saving chat settings for chat:', chatId);
  
  const result = await chrome.storage.local.get(['settings']);
  const allSettings = result.settings || {};
  if (!allSettings.chatSettings) {
    allSettings.chatSettings = {};
  }
  
  currentChatSettings = {
    enabled: document.getElementById('wa-translator-enabled')?.checked || false,
    sourceLanguage: document.getElementById('wa-translator-source-lang')?.value || 'en',
    targetLanguage: document.getElementById('wa-translator-target-lang')?.value || 'pt',
    autoTranslate: document.getElementById('wa-translator-auto-translate')?.checked || false
  };
  
  allSettings.chatSettings[chatId] = currentChatSettings;
  currentChatId = chatId;

  await chrome.storage.local.set({ settings: allSettings });
  
  self.logger.info('Settings saved to storage!', { chatId, settings: currentChatSettings });

  // Update button injection and messages translation immediately
  if (window.injectFooterTranslateButton) {
    window.injectFooterTranslateButton();
  }
  if (window.processMessages) {
    window.processMessages();
  }
}

// Toggle dropdown visibility
async function toggleDropdown(show) {
  const dropdown = createSettingsDropdown();
  const button = document.getElementById('wa-translator-button');
  
  if (!button) return;

  if (show) {
    const rect = button.getBoundingClientRect();
    dropdown.style.left = `${rect.left - 200}px`;
    dropdown.style.top = `${rect.bottom + 10}px`;
    dropdown.style.display = 'block';
    await loadCurrentChatSettings();
  } else {
    dropdown.style.display = 'none';
    await saveCurrentChatSettings();
  }
}

// Outgoing message translation preview
let translationPreviewElement = null;
let translationInputElement = null;
let originalTextElement = null;
let debounceTimer = null;

function createTranslationPreview() {
  if (translationPreviewElement) {
    return translationPreviewElement;
  }

  translationPreviewElement = document.createElement('div');
  translationPreviewElement.id = 'wa-translator-preview';
  translationPreviewElement.className = 'wa-translator-preview';
  // Make it a fixed floating panel
  translationPreviewElement.style.position = 'fixed';
  translationPreviewElement.style.bottom = '80px';
  translationPreviewElement.style.right = '20px';
  translationPreviewElement.style.width = '350px';
  translationPreviewElement.style.maxHeight = '400px';
  translationPreviewElement.style.overflowY = 'auto';
  translationPreviewElement.style.background = '#fff';
  translationPreviewElement.style.border = '1px solid #e0e0e0';
  translationPreviewElement.style.borderRadius = '12px';
  translationPreviewElement.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  translationPreviewElement.style.zIndex = '99999';
  translationPreviewElement.style.padding = '16px';
  translationPreviewElement.style.display = 'none'; // Hidden by default
  
  translationPreviewElement.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
      <h4 style="margin: 0; color: #46459C; font-size: 16px;">Tradução</h4>
      <button id="wa-translator-preview-close" style="background: none; border: none; cursor: pointer; font-size: 20px; color: #667781; padding: 0; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>
    <div class="wa-translator-preview-original" style="margin-bottom: 12px;">
      <span class="wa-translator-preview-label">Original:</span>
      <div class="wa-translator-preview-original-text" id="wa-translator-preview-original" style="word-break: break-word;"></div>
    </div>
    <div class="wa-translator-preview-translated">
      <span class="wa-translator-preview-label">Tradução (editável):</span>
      <textarea class="wa-translator-preview-translated-text" id="wa-translator-preview-translated" placeholder="Traduzindo..." style="font-family: inherit;"></textarea>
    </div>
    <button id="wa-translator-preview-use" style="margin-top: 12px; width: 100%; padding: 10px; background: #46459C; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">Usar Tradução</button>
  `;
  
  // Add close button listener
  setTimeout(() => {
    const closeBtn = document.getElementById('wa-translator-preview-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        translationPreviewElement.style.display = 'none';
      });
    }
    
    // Add "Use Translation" button listener
    const useBtn = document.getElementById('wa-translator-preview-use');
    if (useBtn) {
      useBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const translation = translationInputElement.value;
        const inputElement = getWhatsAppInput();
        
        if (translation && inputElement) {
          await setWhatsAppInputText(inputElement, translation);
          translationPreviewElement.style.display = 'none';
        }
      });
    }
  }, 50);

  translationInputElement = translationPreviewElement.querySelector('#wa-translator-preview-translated');

  // Prevent overwriting user edits
  translationInputElement.addEventListener('input', () => {
    translationInputElement.dataset.userEdited = 'true';
  });

  // Make preview draggable
  let isDraggingPreview = false;
  let previewOffsetX = 0;
  let previewOffsetY = 0;
  
  const previewHeader = translationPreviewElement.querySelector('h4');
  if (previewHeader) {
    previewHeader.style.cursor = 'move';
    previewHeader.addEventListener('mousedown', (e) => {
      isDraggingPreview = true;
      const rect = translationPreviewElement.getBoundingClientRect();
      previewOffsetX = e.clientX - rect.left;
      previewOffsetY = e.clientY - rect.top;
    });
  }
  
  document.addEventListener('mousemove', (e) => {
    if (!isDraggingPreview) return;
    
    let x = e.clientX - previewOffsetX;
    let y = e.clientY - previewOffsetY;
    
    // Keep within screen bounds
    x = Math.max(0, Math.min(x, window.innerWidth - translationPreviewElement.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - translationPreviewElement.offsetHeight));
    
    translationPreviewElement.style.left = x + 'px';
    translationPreviewElement.style.top = y + 'px';
    translationPreviewElement.style.bottom = 'auto';
    translationPreviewElement.style.right = 'auto';
  });
  
  document.addEventListener('mouseup', () => {
    isDraggingPreview = false;
  });

  // Add to page as fixed floating panel
  document.body.appendChild(translationPreviewElement);
  self.logger.info('Preview added as floating panel!');

  return translationPreviewElement;
}

function getWhatsAppInput() {
  const selectors = [
    '[data-testid="conversation-compose-box-input"]',
    'footer [contenteditable="true"][role="textbox"]',
    '[data-testid="compose-box"] [contenteditable="true"]'
  ];

  for (const selector of selectors) {
    const input = document.querySelector(selector);
    if (input) return input;
  }

  return null;
}

function getInputText(inputElement) {
  if (!inputElement) return { text: '', fromSelection: false };

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && inputElement.contains(selection.anchorNode)) {
    const selectedText = selection.toString().trim();
    if (selectedText) {
      self.logger.info('Using selected text:', selectedText);
      return { text: selectedText, fromSelection: true };
    }
  }

  let text = inputElement.innerText?.trim() || inputElement.textContent?.trim() || '';

  if (!text && inputElement.innerHTML) {
    text = inputElement.innerHTML.replace(/<br[^>]*>/gi, '\n').replace(/<[^>]*>/g, '').trim();
  }

  self.logger.info('Extracted input text:', text);
  return { text, fromSelection: false };
}

async function clearWhatsAppInput(inputElement) {
  inputElement.focus();
  await new Promise((resolve) => setTimeout(resolve, 10));

  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);
  await new Promise((resolve) => setTimeout(resolve, 30));

  if (inputElement.innerText.trim()) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(inputElement);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('delete', false, null);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
}

async function setWhatsAppInputText(inputElement, text, replaceSelectionOnly = false) {
  if (!inputElement || !text) return false;

  inputElement.focus();
  await new Promise((resolve) => setTimeout(resolve, 20));

  const selection = window.getSelection();
  
  if (!replaceSelectionOnly) {
    // Select the entire content of the input box using Selection range
    const range = document.createRange();
    range.selectNodeContents(inputElement);
    selection.removeAllRanges();
    selection.addRange(range);
    await new Promise((resolve) => setTimeout(resolve, 20));
  } else {
    // Check if selection is actually inside the input box
    const hasSelectionInInput =
      selection &&
      selection.rangeCount > 0 &&
      inputElement.contains(selection.anchorNode) &&
      selection.toString().trim();
      
    if (!hasSelectionInInput) {
      // If no valid selection inside the input box, select everything
      const range = document.createRange();
      range.selectNodeContents(inputElement);
      selection.removeAllRanges();
      selection.addRange(range);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }

  // Insert text: this replaces the selection (whether it's user selection or the entire input content)
  document.execCommand('insertText', false, text);
  await new Promise((resolve) => setTimeout(resolve, 30));

  let success = inputElement.innerText.trim() === text.trim();
  
  if (!success && !replaceSelectionOnly) {
    // Fallback: Direct DOM manipulation with input event (essential for newer WhatsApp Web Lexical editors)
    self.logger.info('execCommand failed to replace text, using Lexical direct fallback...');
    
    // Clear current contents
    inputElement.innerHTML = '';
    
    // Create standard Lexical paragraph structure
    const p = document.createElement('p');
    p.className = 'selectable-text copyable-text x15bjb6t x1n2onr6';
    p.dir = 'ltr';
    const span = document.createElement('span');
    span.className = 'selectable-text copyable-text';
    span.textContent = text;
    p.appendChild(span);
    inputElement.appendChild(p);
    
    // Dispatch input event to force Lexical to update its internal React state
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    
    success = inputElement.innerText.trim() === text.trim();
  }

  self.logger.info('Input replace success:', success, 'current:', inputElement.innerText.trim());
  return success;
}

// Pré-visualização desativada — tradução substitui direto na barra de conversa
function updateTranslationPreview() {
  if (translationPreviewElement) {
    translationPreviewElement.style.display = 'none';
  }
}

// Debounce function to limit API calls
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Translate text
async function translateText(text) {
  if (!text.trim()) {
    return '';
  }

  // For outgoing messages (what we write), we swap languages:
  // Source: my language (what we write in)
  // Target: contact's language (what we want to send)
  const sourceLang = currentChatSettings.targetLanguage;
  const targetLang = currentChatSettings.sourceLanguage;

  self.logger.info('translateText called with:', {
    text,
    sourceLang,
    targetLang
  });

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      text: text,
      sourceLang,
      targetLang
    });

    self.logger.info('Received response from background:', response);

    if (response.success) {
      return response.translation;
    } else {
      self.logger.error('Translation failed:', response.error);
      throw new Error(response.error || 'Erro na API de tradução.');
    }
  } catch (error) {
    self.logger.error('Error calling translation service:', error);
    throw error;
  }
}

// Monitor WhatsApp input (sem pré-visualização automática)
function monitorWhatsAppInput() {
  const checkInterval = setInterval(() => {
    const input = getWhatsAppInput();
    if (input) {
      clearInterval(checkInterval);
      monitorSendButton();
    }
  }, 500);
}

// Function to locate the emoji button inside the compose box
function getEmojiButton() {
  // 1. Search for title tags with text containing "smiley", "sticker", or "emoji" inside the compose box
  const titles = document.querySelectorAll('[data-testid="compose-box"] title');
  for (const title of titles) {
    const text = title.textContent?.toLowerCase() || '';
    if (text.includes('smiley') || text.includes('sticker') || text.includes('emoji')) {
      const btn = title.closest('button') || title.closest('.x78zum5.x1q0g3np.xh8yej3.xl56j7k') || title.closest('span');
      if (btn) return btn;
    }
  }

  // 2. Fallback to selectors targeting attributes
  const selectors = [
    '[data-testid="compose-box"] [data-icon="wds-ic-sticker-smiley"]',
    '[data-testid="compose-box"] [data-icon="smiley"]',
    '[data-testid="compose-box"] button[aria-label="Emojis, GIFs, figurinhas"]',
    '[data-testid="compose-box"] button[aria-label="Emojis"]',
    '[data-testid="compose-box"] button[aria-label="Figurinhas"]',
    '[data-testid="compose-box"] button[aria-label*="emoji" i]',
    '[data-testid="compose-box"] button[aria-label*="sticker" i]'
  ];
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }

  return null;
}

// Function to get the insertion point in the chat footer (to the right of the emoji button, inside the rounded bar)
function getFooterInsertionPoint() {
  // 1. Primary choice: find the input box wrapper and insert before it.
  // This places our button to the left of the input field, which is right next to the emoji button,
  // directly inside the bottom bar flex row. This is highly robust and avoids third-party wrapper conflicts.
  const inputWrapper = document.querySelector('[data-testid="compose-box"] .x1n2onr6.xh8yej3.xjdcl3y') || 
                       getWhatsAppInput()?.closest('.xjdcl3y') ||
                       getWhatsAppInput()?.parentElement;
                       
  if (inputWrapper && inputWrapper.parentElement) {
    return { parent: inputWrapper.parentElement, reference: inputWrapper };
  }

  // 2. Fallback: find the emoji button and insert after its top-level sibling
  const emojiIcon = getEmojiButton();
  if (emojiIcon) {
    const row = emojiIcon.closest('[tabindex="-1"]') || 
                emojiIcon.closest('[data-testid="compose-box"] > div') ||
                emojiIcon.parentElement;
                
    if (row) {
      let current = emojiIcon;
      while (current && current.parentElement !== row) {
        current = current.parentElement;
      }
      if (current) {
        return { parent: row, reference: current.nextSibling };
      }
    }
  }

  return null;
}

// Global reference for original icon SVG
const ORIGINAL_ICON_HTML = `
  <span aria-hidden="true" class="xxk0z11 xvy4d1p">
    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
      <title>ic-translate</title>
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path>
    </svg>
  </span>
`;

// Loading icon spinner SVG
const LOADING_ICON_HTML = `
  <span aria-hidden="true" class="xxk0z11 xvy4d1p">
    <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="wa-translator-spinning">
      <title>Traduzindo...</title>
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
  </span>
`;

// Function to inject translate button next to send button in the footer
function injectFooterTranslateButton() {
  // Check if translation is enabled for this chat
  if (!currentChatSettings.enabled) {
    // If not enabled, make sure any existing footer button is removed
    const existing = document.getElementById('wa-translator-footer-button-wrapper');
    if (existing) {
      existing.remove();
      self.logger.info('Removed footer translate button because translation is disabled.');
    }
    return;
  }

  // Check if button already exists
  if (document.getElementById('wa-translator-footer-button-wrapper')) {
    return;
  }

  self.logger.info('Injecting footer translate button...');
  
  const insertionPoint = getFooterInsertionPoint();
  if (!insertionPoint) {
    self.logger.info('Footer insertion point not found. Cannot inject footer button yet.');
    return;
  }

  // Create footer translate button container (clean custom layout that matches other footer buttons)
  const buttonWrapper = document.createElement('div');
  buttonWrapper.id = 'wa-translator-footer-button-wrapper';
  buttonWrapper.style.display = 'flex';
  buttonWrapper.style.alignItems = 'center';
  buttonWrapper.style.justifyContent = 'center';
  buttonWrapper.style.padding = '0 4px';
  buttonWrapper.style.alignSelf = 'center';

  buttonWrapper.innerHTML = `
    <button aria-label="Traduzir mensagem" type="button" class="wa-translator-footer-btn" style="background: transparent; border: none; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; width: 40px; height: 40px; transition: background-color 0.15s ease;">
      <div id="wa-translator-footer-icon-container" style="display: flex; align-items: center; justify-content: center;">
        ${ORIGINAL_ICON_HTML}
      </div>
    </button>
  `;

  // Insert button using the resolved insertion point
  try {
    insertionPoint.parent.insertBefore(buttonWrapper, insertionPoint.reference);
    self.logger.info('Footer translate button injected successfully!');

    // Add click listener
    const button = buttonWrapper.querySelector('button');
    if (button) {
      button.addEventListener('click', handleFooterButtonClick);
    }
  } catch (error) {
    self.logger.error('Error inserting footer translate button:', error);
  }
}

// Click handler for footer translation button
async function handleFooterButtonClick(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  self.logger.info('=== FOOTER TRANSLATE BUTTON CLICKED ===');

  await loadCurrentChatSettings();
  self.logger.info('Current chat settings:', currentChatSettings);
  
  const inputElement = getWhatsAppInput();
  self.logger.info('Input element found:', !!inputElement);
  if (!inputElement) {
    self.logger.error('Input not found');
    alert('Campo de mensagem não encontrado!');
    return;
  }
  
  const originalText = getInputText(inputElement);
  self.logger.info('Original text:', originalText.text);
  
  if (!originalText.text.trim()) {
    self.logger.info('No text to translate');
    alert('Digite algo para traduzir!');
    return;
  }
  
  const iconContainer = document.getElementById('wa-translator-footer-icon-container');
  if (iconContainer) {
    iconContainer.innerHTML = LOADING_ICON_HTML;
  }
  
  try {
    const translation = await translateText(originalText.text);
    self.logger.info('Translation result:', translation);
    
    if (!translation) {
      alert('Não foi possível obter a tradução. Resposta vazia.');
      return;
    }

    const success = await setWhatsAppInputText(inputElement, translation, originalText.fromSelection);
    if (!success) {
      try {
        await navigator.clipboard.writeText(translation);
        alert('Tradução copiada! Cole na barra com Ctrl+V.');
      } catch {
        alert('Tradução: ' + translation);
      }
    }
  } catch (error) {
    self.logger.error('Translation error:', error);
    alert('Erro ao traduzir: ' + error.message);
  } finally {
    if (iconContainer) {
      iconContainer.innerHTML = ORIGINAL_ICON_HTML;
    }
  }
}

// Get unique message ID based on WhatsApp Web DOM attributes
function getMessageId(msgContainer) {
  const row = msgContainer.closest('[data-id]');
  if (row) {
    return row.getAttribute('data-id');
  }
  const textEl = msgContainer.querySelector('[data-testid="selectable-text"]');
  return textEl ? textEl.innerText || textEl.textContent : null;
}

// Helper to determine if a message is incoming (received) or outgoing (sent by user)
function isIncomingMessage(msgContainer) {
  if (!msgContainer) return false;

  // 1. If it has a tail-in element, it is definitely incoming
  if (msgContainer.querySelector('[data-testid="tail-in"]')) {
    return true;
  }
  
  // 2. If it has a tail-out element, it is definitely outgoing
  if (msgContainer.querySelector('[data-testid="tail-out"]')) {
    return false;
  }

  // 3. Fallback: check for standard incoming/outgoing CSS classes (if they exist)
  if (msgContainer.closest('.message-in') || msgContainer.closest('[class*="message-in"]')) {
    return true;
  }
  if (msgContainer.closest('.message-out') || msgContainer.closest('[class*="message-out"]')) {
    return false;
  }

  // 4. Fallback: Check computed alignment of the bubble container itself
  // In WhatsApp's flex column row layout, outgoing messages have align-self: flex-end.
  const msgStyle = window.getComputedStyle(msgContainer);
  if (msgStyle.alignSelf === 'flex-end' || msgStyle.float === 'right') {
    return false; // Outgoing
  }

  // 5. Fallback for consecutive messages: check for status ticks (only outgoing messages have ticks/status icons)
  const hasTicks = msgContainer.querySelector([
    '[data-icon="msg-check"]',
    '[data-icon="msg-dblcheck"]',
    '[data-icon="msg-dblcheck-ack"]',
    '[data-icon="msg-time"]',
    '[data-testid="msg-check"]',
    '[data-testid="msg-dblcheck"]',
    '[data-testid="msg-dblcheck-ack"]',
    '[data-testid="msg-time"]'
  ].join(', '));

  if (hasTicks) {
    return false; // Outgoing
  }

  // 6. Fallback for consecutive messages: check computed flexbox alignment of row (outgoing is aligned right/flex-end)
  const row = msgContainer.closest('[data-id]') || msgContainer.closest('.focusable-list-item');
  if (row) {
    const style = window.getComputedStyle(row);
    if (style.justifyContent === 'flex-end' || style.alignItems === 'flex-end') {
      return false; // Outgoing
    }
  }

  // If no ticks, aligned to the left, and no outgoing traits, it's incoming
  return true;
}

// Process messages inside the active chat (incoming messages)
function processMessages() {
  // If translation is not enabled for this conversation, we don't translate
  if (!currentChatSettings.enabled) {
    return;
  }

  // Find all message containers
  const messages = document.querySelectorAll('[data-testid="msg-container"]');
  
  messages.forEach((msg) => {
    const msgId = getMessageId(msg);
    if (!msgId) return;

    // If the message has already been processed for this ID, skip it
    if (msg.dataset.waTranslatorMsgId === msgId) {
      return;
    }

    // Clean up previous recycled state if message ID has changed
    msg.dataset.waTranslatorMsgId = msgId;
    msg.removeAttribute('data-wa-translator-processed'); // Clean up old static attribute if present
    
    const oldCard = msg.querySelector('.wa-translator-message-card');
    if (oldCard) oldCard.remove();
    
    const oldLoading = msg.querySelector('.wa-translator-message-loading');
    if (oldLoading) oldLoading.remove();
    
    const oldHoverBtn = msg.querySelector('.wa-translator-hover-btn');
    if (oldHoverBtn) oldHoverBtn.remove();
    
    // Check if message is incoming
    const isIncoming = isIncomingMessage(msg);
    if (!isIncoming) return;
    
    // Find selectable text element containing the message text
    const textEl = msg.querySelector('[data-testid="selectable-text"]');
    if (!textEl) return;
    
    const text = textEl.innerText || textEl.textContent || '';
    if (!text.trim()) return;

    if (currentChatSettings.autoTranslate) {
      // Translate automatically
      performMessageTranslation(msg, textEl, text, false);
    }
  });
}

// Perform translation of an incoming message and append card
async function performMessageTranslation(msgContainer, textEl, text, isManual = false) {
  // Ensure we don't add multiple translation cards to the same message bubble
  if (msgContainer.querySelector('.wa-translator-message-card')) return;
  
  // Resolve the insertion target inside the message bubble (.copyable-text is the standard text/meta wrapper)
  const appendTarget = textEl.parentElement?.closest('.copyable-text') || textEl.parentElement || msgContainer;

  // Create loading element
  const loadingCard = document.createElement('div');
  loadingCard.className = 'wa-translator-message-loading';
  loadingCard.textContent = 'Traduzindo...';
  appendTarget.appendChild(loadingCard);
  
  try {
    // For incoming messages:
    // Source: Contact's language (sourceLanguage)
    // Target: My language (targetLanguage)
    const sourceLang = currentChatSettings.sourceLanguage;
    const targetLang = currentChatSettings.targetLanguage;
    
    self.logger.info('Translating incoming message:', { text: text.substring(0, 30), sourceLang, targetLang });
    
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      text: text,
      sourceLang: sourceLang,
      targetLang: targetLang
    });
    
    loadingCard.remove();
    
    if (response.success && response.translation) {
      // Check if translation is identical to original text (ignoring case, whitespace, and punctuation)
      const cleanOriginal = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g,"").replace(/\s+/g, " ");
      const cleanTranslation = response.translation.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g,"").replace(/\s+/g, " ");
      
      if (isManual || cleanOriginal !== cleanTranslation) {
        const translationCard = document.createElement('div');
        translationCard.className = 'wa-translator-message-card';
        translationCard.textContent = `└ ${response.translation}`;
        appendTarget.appendChild(translationCard);
      }
    } else {
      self.logger.error('Failed to translate incoming message:', response.error);
      const errorCard = document.createElement('div');
      errorCard.className = 'wa-translator-message-loading';
      errorCard.textContent = 'Erro ao traduzir';
      appendTarget.appendChild(errorCard);
      setTimeout(() => errorCard.remove(), 3000);
    }
  } catch (error) {
    self.logger.error('Error in performMessageTranslation:', error);
    loadingCard.remove();
  }
}

// Inject translate button next to the hover reaction/context menu buttons in the message container
// Helper function to find the message container from a hover trigger element
function findMsgContainerFromTrigger(trigger) {
  // 1. Try closest msg-container directly
  let msgContainer = trigger.closest('[data-testid="msg-container"]');
  if (msgContainer) return msgContainer;

  // 2. Try closest message row by data-id or common class/attributes
  const row = trigger.closest('[data-id]') || 
              trigger.closest('[data-testid^="conv-msg-"]') ||
              trigger.closest('.focusable-list-item') ||
              trigger.closest('.x1n2onr6');
  if (row) {
    msgContainer = row.querySelector('[data-testid="msg-container"]');
    if (msgContainer) return msgContainer;
  }

  // 3. Fallback: parent traversal up to 6 levels to find any sibling msg-container
  let current = trigger;
  for (let i = 0; i < 6; i++) {
    if (!current) break;
    const siblingContainer = current.querySelector('[data-testid="msg-container"]');
    if (siblingContainer) return siblingContainer;
    
    // Check siblings of current
    let sibling = current.parentElement?.firstElementChild;
    while (sibling) {
      if (sibling !== current) {
        const found = sibling.matches('[data-testid="msg-container"]') ? sibling : sibling.querySelector('[data-testid="msg-container"]');
        if (found) return found;
      }
      sibling = sibling.nextElementSibling;
    }
    current = current.parentElement;
  }

  return null;
}

// Inject translate button next to the hover reaction/context menu buttons in the message container
function injectHoverTranslateButtons() {
  const HOVER_TRIGGER_SELECTORS = [
    '[data-testid="msg-react"]',
    '[data-testid="react-button"]',
    '[data-testid="reaction-entry-point"]',
    '[data-icon="thumbs-up-react"]',
    '[data-icon="react"]',
    '[aria-label="Reagir à mensagem"]',
    '[aria-label="Reagir"]',
    '[aria-label="React to message"]',
    '[aria-label="React"]',
    '[aria-label="Reaction"]',
    '[data-testid="down-context"]',
    '[data-icon="down-context"]',
    '[aria-label="Menu contextual"]',
    '[aria-label="Context menu"]',
    '[aria-label="Menu de contexto"]',
    '[aria-label="Mais opções"]',
    '[aria-label="Menu"]',
    '[aria-label="Opções"]'
  ];

  if (!currentChatSettings.enabled) {
    // Clean up any hover translate buttons if settings are disabled
    const activeButtons = document.querySelectorAll('.wa-translator-hover-btn');
    activeButtons.forEach((btn) => btn.remove());
    return;
  }

  // Cleanup: remove hover translate buttons whose triggers are no longer present (user hovered off)
  const activeButtons = document.querySelectorAll('.wa-translator-hover-btn');
  activeButtons.forEach((btn) => {
    const container = btn.parentElement;
    if (container) {
      const hasTrigger = container.querySelector(HOVER_TRIGGER_SELECTORS.join(', '));
      if (!hasTrigger) {
        self.logger.info('Hover off: removing stray button from DOM.');
        btn.remove();
      }
    }
  });

  // Query common hover interaction buttons in WhatsApp Web
  const triggers = document.querySelectorAll(HOVER_TRIGGER_SELECTORS.join(', '));

  if (triggers.length > 0) {
    self.logger.info(`Hover triggers found: ${triggers.length}`);
  }

  triggers.forEach((trigger, idx) => {
    // Find the message container ancestor robustly
    const msgContainer = findMsgContainerFromTrigger(trigger);
    if (!msgContainer) {
      self.logger.info(`Trigger ${idx} skipped: msgContainer not found`);
      return;
    }

    // Only for incoming messages
    const isIncoming = isIncomingMessage(msgContainer);
    if (!isIncoming) {
      self.logger.info(`Trigger ${idx} skipped: not incoming message`);
      return;
    }

    // Find the outer hover wrapper container (usually .x1c4vz4f inside the message row flex structure)
    let container = trigger.parentElement;
    const hoverWrapper = trigger.closest('.x1c4vz4f');
    if (hoverWrapper) {
      const parentWrapper = hoverWrapper.parentElement?.closest('.x1c4vz4f') || hoverWrapper.parentElement?.closest('.x78zum5');
      container = parentWrapper || hoverWrapper;
    }

    if (!container) {
      self.logger.info(`Trigger ${idx} skipped: parent element (container) not found`);
      return;
    }
    
    if (container.querySelector('.wa-translator-hover-btn')) {
      self.logger.info(`Trigger ${idx} skipped: already has hover button in container`);
      return;
    }

    // Get message text element and text
    const textEl = msgContainer.querySelector('[data-testid="selectable-text"]');
    if (!textEl) {
      self.logger.info(`Trigger ${idx} skipped: textEl not found`);
      return;
    }
    const text = textEl.innerText || textEl.textContent || '';
    if (!text.trim()) {
      self.logger.info(`Trigger ${idx} skipped: empty text`);
      return;
    }

    // Check if the message has already been translated
    if (msgContainer.querySelector('.wa-translator-message-card')) {
      self.logger.info(`Trigger ${idx} skipped: message already translated`);
      return;
    }

    self.logger.info(`Trigger ${idx} passed all checks! Injecting...`);

    // Create the "Traduzir" hover button
    const hoverBtn = document.createElement('button');
    hoverBtn.type = 'button';
    hoverBtn.className = 'wa-translator-hover-btn';
    hoverBtn.textContent = 'Traduzir';
    hoverBtn.style.marginLeft = '24px'; // Inline style to guarantee alignment and prevent Chrome CSS caching issues

    hoverBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      performMessageTranslation(msgContainer, textEl, text, true);
      hoverBtn.remove();
    });

    // Find the reaction button descendant
    const reactBtn = container.querySelector([
      '[data-testid="msg-react"]',
      '[data-testid="react-button"]',
      '[data-testid="reaction-entry-point"]',
      '[data-icon="thumbs-up-react"]',
      '[data-icon="react"]',
      '[aria-label="Reagir à mensagem"]',
      '[aria-label="Reagir"]',
      '[aria-label="React to message"]',
      '[aria-label="React"]'
    ].join(', '));

    let referenceChild = null;
    if (reactBtn) {
      // Find the direct child of container that contains reactBtn
      let current = reactBtn;
      while (current && current.parentElement !== container) {
        current = current.parentElement;
      }
      referenceChild = current;
    } else {
      // Fallback: find the direct child of container that contains trigger
      let current = trigger;
      while (current && current.parentElement !== container) {
        current = current.parentElement;
      }
      referenceChild = current;
    }

    if (referenceChild) {
      // Insert after the reference child
      container.insertBefore(hoverBtn, referenceChild.nextSibling);
    } else {
      // Last fallback: just append to container
      container.appendChild(hoverBtn);
    }
    self.logger.info('Hover translate button injected next to reaction emoji successfully!');
  });
}

// Monitor send button — envia texto já traduzido na barra
function monitorSendButton() {
  const checkSendButton = setInterval(() => {
    let sendButton = document.querySelector('button[aria-label="Enviar"]');
    if (!sendButton) {
      sendButton = document.querySelector('[data-testid="compose-btn-send"]');
    }
    
    if (sendButton) {
      clearInterval(checkSendButton);
    }
  }, 500);
}

// Initialize event listeners
document.addEventListener('wa-translator:toggle-settings', async () => {
  const dropdown = document.getElementById('wa-translator-dropdown');
  const isVisible = dropdown && dropdown.style.display !== 'none';
  await toggleDropdown(!isVisible);
});

document.addEventListener('click', async (e) => {
  const dropdown = document.getElementById('wa-translator-dropdown');
  if (dropdown && dropdown.style.display !== 'none' && !dropdown.contains(e.target)) {
    const button = document.getElementById('wa-translator-button');
    if (!button || !button.contains(e.target)) {
      await toggleDropdown(false);
    }
  }
});

// Keyboard shortcut Alt + T to translate outgoing message
document.addEventListener('keydown', async (e) => {
  if (e.altKey && (e.key === 't' || e.key === 'T' || e.keyCode === 84)) {
    const inputElement = getWhatsAppInput();
    if (inputElement) {
      e.preventDefault();
      e.stopPropagation();
      self.logger.info('Alt+T keyboard shortcut triggered translation');
      await handleFooterButtonClick();
    }
  }
});

// Expose functions globally to be called by whatsapp-observer.js
window.injectFooterTranslateButton = injectFooterTranslateButton;
window.processMessages = processMessages;
window.injectHoverTranslateButtons = injectHoverTranslateButtons;

// Observar troca de conversas e recarregar configurações
watchChatChanges(() => {
  loadCurrentChatSettings().then(() => {
    injectFooterTranslateButton();
    processMessages();
    injectHoverTranslateButtons();
  });
});

// Load settings on initial load and start monitoring
let initRetries = 0;

async function initializeTranslator() {
  createSettingsDropdown();
  await loadCurrentChatSettings();
  injectFooterTranslateButton();
  processMessages();
  injectHoverTranslateButtons();
  monitorWhatsAppInput();

  if (!getCurrentChatId() && initRetries < 15) {
    initRetries += 1;
    setTimeout(initializeTranslator, 1500);
  }
}

initializeTranslator();

self.logger.info('Translator UI loaded');
