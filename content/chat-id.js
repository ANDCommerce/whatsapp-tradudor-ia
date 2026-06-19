const titleToJidMap = {};

function getCurrentChatId() {
  // 1. Get the conversation title from the header
  const header = document.querySelector('[data-testid="conversation-header"]');
  let currentTitle = null;
  if (header) {
    const titleEl =
      header.querySelector('[data-testid="conversation-info-header-chat-title"]') ||
      header.querySelector('[data-testid="conversation-info-header-chat-title"] span') ||
      header.querySelector('span[dir="auto"][title]') ||
      header.querySelector('div[dir="auto"][title]');

    currentTitle = titleEl?.getAttribute('title') || titleEl?.textContent?.trim() || null;

    // Fallback: Search all spans in the header that have a title matching their text
    if (!currentTitle) {
      const spans = header.querySelectorAll('span[title]');
      for (const span of spans) {
        const text = span.textContent?.trim();
        const title = span.getAttribute('title');
        if (title && text && title === text) {
          currentTitle = title;
          break;
        }
      }
    }

    // Fallback 2: Get text from the first span that has dir="auto"
    if (!currentTitle) {
      const span = header.querySelector('span[dir="auto"]');
      if (span) {
        currentTitle = span.textContent?.trim() || null;
      }
    }
  }

  // 2. Try to get JID from URL
  const url = window.location.href;
  const urlPatterns = [
    /\/(\d+@[cg]\.us)/,
    /\/(\d+-\d+@g\.us)/,
    /\/(\d+@lid)/
  ];

  let resolvedJid = null;
  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match) {
      resolvedJid = match[1];
      break;
    }
  }

  // 3. Try to get JID from active sidebar item
  if (!resolvedJid) {
    const activeChat = document.querySelector('#pane-side [aria-selected="true"]');
    if (activeChat) {
      const chatRow = activeChat.closest('[data-id]');
      if (chatRow) {
        const dataId = chatRow.getAttribute('data-id') || '';
        const jidMatch = dataId.match(/(\d+@[cg]\.us|\d+-\d+@g\.us|\d+@lid)/);
        if (jidMatch) {
          resolvedJid = jidMatch[1];
        }
      }
    }
  }

  // 4. Update map if we have both title and resolved JID
  if (currentTitle && resolvedJid) {
    titleToJidMap[currentTitle] = resolvedJid;
  }

  // 5. If we have a resolved JID, return it
  if (resolvedJid) {
    return resolvedJid;
  }

  // 6. If we don't have a JID, but we have a header title, check our map
  if (currentTitle) {
    if (titleToJidMap[currentTitle]) {
      return titleToJidMap[currentTitle];
    }
    return `contact:${currentTitle}`;
  }

  return null;
}

function watchChatChanges(onChatChange) {
  let lastChatId = getCurrentChatId();

  const checkChat = () => {
    const chatId = getCurrentChatId();
    
    // Only allow updating lastChatId if a chat is actually open,
    // or if the chat is completely closed (header is absent).
    const isChatOpen = !!document.querySelector('[data-testid="conversation-header"]');
    if (!isChatOpen) {
      if (lastChatId !== null) {
        lastChatId = null;
        onChatChange(null);
      }
      return;
    }

    if (chatId && chatId !== lastChatId) {
      lastChatId = chatId;
      onChatChange(chatId);
    }
  };

  const headerObserver = new MutationObserver(checkChat);
  const sidebarObserver = new MutationObserver(checkChat);

  const attachObservers = () => {
    const header = document.querySelector('[data-testid="conversation-header"]');
    const sidebar = document.querySelector('#pane-side');
    if (header) headerObserver.observe(header, { childList: true, subtree: true, characterData: true });
    if (sidebar) sidebarObserver.observe(sidebar, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected'] });
  };

  attachObservers();
  setInterval(() => {
    attachObservers();
    checkChat();
  }, 2000);

  window.addEventListener('popstate', () => setTimeout(checkChat, 300));

  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(checkChat, 300);
  };
}
