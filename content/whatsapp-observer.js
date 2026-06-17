
function injectTranslationButton() {
  // Check if button already exists
  if (document.getElementById('wa-translator-button')) {
    return;
  }

  self.logger.info('injectTranslationButton called - looking for button container...');
  
  // Try multiple selectors for the button container
  const buttonContainerSelectors = [
    '.x1c4vz4f.x2lah0s.xdl72j9.xlese2p',
    '[data-testid="conversation-header"] .x1c4vz4f',
    '[data-testid="conversation-header"] div:last-child'
  ];
  
  let buttonContainer = null;
  for (const selector of buttonContainerSelectors) {
    buttonContainer = document.querySelector(selector);
    if (buttonContainer) {
      self.logger.info(`Button container found with selector: ${selector}`);
      break;
    }
  }
  
  if (!buttonContainer) {
    self.logger.info('Button container NOT found with any selector!');
    return;
  }

  // Create translation button (using WhatsApp's container class)
  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'x150mmf0'; // WhatsApp's button container class
  buttonWrapper.id = 'wa-translator-button';
  buttonWrapper.innerHTML = `
    <span class="html-span xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x1hl2dhg x16tdsg8 x1vvkbs x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j">
      <button aria-label="Configurações de tradução" type="button" class="html-button xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x178xt8z x1lun4ml xso031l xpilrb4 x1n2onr6 x1ejq31n x18oe1m7 x1sy0etr xstzfhl x1so62im x1syfmzz x1ja2u2z x1ypdohk x1s928wv x1j6awrg x4eaejv x1wsn0xg x1r0yslu x2q1x1w xapdjt xr6f91l x5rv0tg x1akc3lz xikp0eg x1xl5mkn x1mfml39 x1l5mzlr xgmdoj8 x1f1wgk5 x1x3ic1u xjbqb8w xuwfzo9 x1wb366y xtnn1bt x9v5kkp xmw7ebm xrdum7p x2lah0s x1lliihq xk8lq53 x9f619 xt8t1vi x1xc408v x129tdwq x15urzxu x1vqgdyp x100vrsf">
        <div class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x78zum5 xdt5ytf">
          <div class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 x1q0g3np xh8yej3 xl56j7k">
            <div class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl x6s0dn4 x78zum5 x1vjfegm">
              <span aria-hidden="true" class="xxk0z11 xvy4d1p">
                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="currentColor">
                  <title>ic-translate</title>
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor"></path>
                </svg>
              </span>
            </div>
            <div class="html-div xdj266r x14z9mp xat24cr x1lziwak xexx8yu xyri2b x18d9i69 x1c1uobl xdt5ytf x6s0dn4 x78zum5 x1vjfegm x1c4vz4f"></div>
          </div>
        </div>
      </button>
    </span>
  `;

  // Find the actual button wrapper div (the nested one that contains the buttons)
  let buttonWrapperParent = buttonContainer.querySelector('.x1s70e7g');
  if (!buttonWrapperParent) {
    buttonWrapperParent = buttonContainer;
  }
  
  // Find the spacer div and insert our button BEFORE it
  try {
    const spacer = buttonWrapperParent.querySelector('.x10l6tqk');
    if (spacer) {
      self.logger.info('Spacer found! Inserting button...');
      buttonWrapperParent.insertBefore(buttonWrapper, spacer);
      self.logger.info('Translation button added successfully!');
    } else {
      // Fallback: insert before last button if spacer not found
      self.logger.info('Spacer NOT found! Using fallback...');
      const lastButton = buttonWrapperParent.lastElementChild;
      if (lastButton) {
        buttonWrapperParent.insertBefore(buttonWrapper, lastButton);
        self.logger.info('Translation button added (fallback)!');
      } else {
        self.logger.info('No buttons found in container!');
      }
    }
    
    // Add click listener to the button
    const button = buttonWrapper.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        // Dispatch custom event that translator.js can listen to
        document.dispatchEvent(new CustomEvent('wa-translator:toggle-settings'));
      });
    }
  } catch (e) {
    self.logger.error('Error inserting button:', e);
    // Last resort: just append to buttonContainer
    try {
      buttonContainer.appendChild(buttonWrapper);
      self.logger.info('Translation button added as last resort!');
      
      // Add click listener even in last resort
      const button = buttonWrapper.querySelector('button');
      if (button) {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          document.dispatchEvent(new CustomEvent('wa-translator:toggle-settings'));
        });
      }
    } catch (e2) {
      self.logger.error('All insertion methods failed:', e2);
    }
  }
}

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
    const header = document.querySelector('[data-testid="conversation-header"]');
    if (header) {
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
