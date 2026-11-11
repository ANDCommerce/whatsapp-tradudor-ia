function isProfileSection(el, header) {
  if (!el || !header || el === header) return false;
  
  const profileSelectors = [
    '[data-testid="conversation-info-header-chat-title"]',
    '[data-testid="chat-title"]',
    '[data-testid="avatar"]',
    '[data-testid="default-user"]',
    '[data-icon="default-user"]',
    '[data-icon="community-outline"]'
  ];

  for (const sel of profileSelectors) {
    const found = header.querySelector(sel);
    if (found) {
      const container = found.closest('[role="button"]') || found.parentElement;
      if (container && (container === el || container.contains(el) || el.contains(container))) {
        return true;
      }
    }
  }

  if (el.querySelector && el.querySelector('[data-testid="conversation-info-header-chat-title"], [data-testid="avatar"], img[src*="whatsapp"], img[src*="blob:"]')) {
    return true;
  }

  return false;
}

function findHeaderActionContainer(header) {
  if (!header) return null;

  // 1. First priority: look for existing action icons on the right side
  const actionButtonSelectors = [
    // Search
    '[data-icon="search"]',
    '[data-icon="search-alt"]',
    '[data-testid="search"]',
    '[data-testid="btn-search"]',
    'button[aria-label*="Pesquisar" i]',
    'button[aria-label*="Search" i]',
    // Menu / Options
    '[data-icon="menu"]',
    '[data-icon="more-options"]',
    '[data-icon="kebab"]',
    '[data-testid="menu"]',
    '[data-testid="conversation-menu-button"]',
    '[data-testid="menu-bar-chat-menu"]',
    'button[aria-label*="Mais opções" i]',
    'button[aria-label*="Mais opcoes" i]',
    'button[aria-label*="More options" i]',
    'button[aria-label*="Menu" i]',
    // Call buttons
    '[data-icon="video-call"]',
    '[data-icon="phone"]',
    '[data-icon="audio-call"]',
    'button[aria-label*="chamada" i]',
    'button[aria-label*="call" i]'
  ];

  let foundActionEl = null;
  for (const selector of actionButtonSelectors) {
    const el = header.querySelector(selector);
    if (el && !isProfileSection(el, header)) {
      foundActionEl = el;
      break;
    }
  }

  if (foundActionEl) {
    const actionBtn = foundActionEl.closest('button') || foundActionEl.closest('[role="button"]') || foundActionEl;
    
    // Find the direct child of header that contains this action button (the right-side container)
    let headerRightChild = actionBtn;
    while (headerRightChild && headerRightChild.parentElement !== header) {
      headerRightChild = headerRightChild.parentElement;
    }

    if (headerRightChild && !isProfileSection(headerRightChild, header)) {
      // Find the specific container holding the buttons
      let container = actionBtn.parentElement;
      while (container && container !== headerRightChild && container.children.length <= 1) {
        container = container.parentElement;
      }
      return {
        container: container || headerRightChild,
        referenceBtn: actionBtn
      };
    }
  }

  // 2. Second priority: WhatsApp's right-side direct child in header (lastElementChild)
  const lastChild = header.lastElementChild;
  if (lastChild && !isProfileSection(lastChild, header)) {
    return {
      container: lastChild,
      referenceBtn: null
    };
  }

  return null;
}

function injectTranslationButton() {
  const header = document.querySelector('[data-testid="conversation-header"]') ||
                 document.querySelector('header');
  if (!header) {
    return;
  }

  const result = findHeaderActionContainer(header);
  if (!result || !result.container) {
    self.logger.info('Action container NOT found in header');
    return;
  }

  const { container, referenceBtn } = result;

  // Check if button already exists
  const existingButton = document.getElementById('wa-translator-button');
  if (existingButton) {
    // If it's already properly placed inside the right container, we're done
    if (container.contains(existingButton) && !isProfileSection(existingButton, header)) {
      return;
    }
    // If it's misplaced (e.g. before the photo) or in a detached container, remove it
    self.logger.info('Removing misplaced or stale translation button...');
    existingButton.remove();
  }

  // Find sample button to inherit classes if possible
  const sampleBtn = container.querySelector('button');
  const sampleBtnClass = sampleBtn ? sampleBtn.className : '';
  const sampleBtnWrapper = sampleBtn && sampleBtn.parentElement !== container ? sampleBtn.parentElement : null;
  const sampleWrapperClass = sampleBtnWrapper ? sampleBtnWrapper.className : '';

  // Create translation button wrapper
  const buttonWrapper = document.createElement('div');
  buttonWrapper.id = 'wa-translator-button';
  buttonWrapper.className = (sampleWrapperClass ? sampleWrapperClass + ' ' : '') + 'wa-translator-header-btn-wrapper';
  buttonWrapper.innerHTML = `
    <button aria-label="Configurações de tradução" title="Configurações de tradução" type="button" class="${sampleBtnClass} wa-translator-header-btn">
      <span aria-hidden="true" style="display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="currentColor">
          <title>ic-translate</title>
          <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"></path>
        </svg>
      </span>
    </button>
  `;

  // Attach event handlers to prevent bubbling up to WhatsApp's profile or action bar
  const button = buttonWrapper.querySelector('button');
  const stopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  if (button) {
    button.addEventListener('click', (e) => {
      stopEvent(e);
      document.dispatchEvent(new CustomEvent('wa-translator:toggle-settings'));
    });
    button.addEventListener('mousedown', stopEvent);
    button.addEventListener('pointerdown', stopEvent);
  }

  buttonWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  buttonWrapper.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  buttonWrapper.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
  });

  // Determine insertion point: prefer inserting before Search button or Menu button
  const searchEl = header.querySelector(
    '[data-icon="search"], [data-icon="search-alt"], [data-testid="search"], [data-testid="btn-search"], button[aria-label*="Pesquisar" i], button[aria-label*="Search" i]'
  );
  const searchBtn = searchEl ? (searchEl.closest('button') || searchEl.closest('[role="button"]') || searchEl) : null;

  const menuEl = header.querySelector(
    '[data-icon="menu"], [data-icon="more-options"], [data-icon="kebab"], [data-testid="menu"], [data-testid="conversation-menu-button"], button[aria-label*="Mais opções" i], button[aria-label*="Mais opcoes" i], button[aria-label*="More options" i], button[aria-label*="Menu" i]'
  );
  const menuBtn = menuEl ? (menuEl.closest('button') || menuEl.closest('[role="button"]') || menuEl) : null;

  const targetBtn = searchBtn || menuBtn || referenceBtn;
  let refItem = null;
  if (targetBtn && container.contains(targetBtn)) {
    refItem = targetBtn;
    while (refItem && refItem.parentElement !== container) {
      refItem = refItem.parentElement;
    }
  }

  try {
    if (refItem && container.contains(refItem)) {
      container.insertBefore(buttonWrapper, refItem);
      self.logger.info('Translation button inserted before action button on right side');
    } else {
      container.appendChild(buttonWrapper);
      self.logger.info('Translation button appended to action container on right side');
    }
  } catch (err) {
    self.logger.error('Error inserting translation button:', err);
  }
}

// Expose globally for cross-script coordination
window.injectTranslationButton = injectTranslationButton;

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    // Try to inject header settings button
    injectTranslationButton();
    
    // Inject footer translate button (next to send button) if loaded
    if (window.injectFooterTranslateButton) {
      window.injectFooterTranslateButton();
    }
    
    // Scan and translate received messages if loaded
    if (window.processMessages) {
      window.processMessages();
    }

    // Inject hover translate button next to reaction button if loaded
    if (window.injectHoverTranslateButtons) {
      window.injectHoverTranslateButtons();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function waitForWhatsApp() {
  const checkInterval = setInterval(() => {
    const isReady = document.querySelector('[data-testid="conversation-header"]') ||
                    document.querySelector('#app') ||
                    document.querySelector('#pane-side');
    if (isReady) {
      clearInterval(checkInterval);
      setupObserver();
      // Try injecting buttons and scanning messages multiple times during load
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          injectTranslationButton();
          if (window.injectFooterTranslateButton) {
            window.injectFooterTranslateButton();
          }
          if (window.processMessages) {
            window.processMessages();
          }
          if (window.injectHoverTranslateButtons) {
            window.injectHoverTranslateButtons();
          }
        }, i * 500);
      }
      self.logger.info('WhatsApp loaded, translation observers ready!');
    }
  }, 500);
}

waitForWhatsApp();
