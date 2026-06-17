function getCurrentChatId() {
  const url = window.location.href;
  const urlPatterns = [
    /\/(\d+@[cg]\.us)/,
    /\/(\d+-\d+@g\.us)/,
    /\/(\d+@lid)/
  ];

  for (const pattern of urlPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  const activeChat =
    document.querySelector('#pane-side [aria-selected="true"]') ||
    document.querySelector('#pane-side [tabindex="0"][data-testid="cell-frame-container"]');

  if (activeChat) {
    const chatRow = activeChat.closest('[data-id]');
    if (chatRow) {
      const dataId = chatRow.getAttribute('data-id') || '';
      const jidMatch = dataId.match(/(\d+@[cg]\.us|\d+-\d+@g\.us|\d+@lid)/);
      if (jidMatch) return jidMatch[1];
    }
  }

  const header = document.querySelector('[data-testid="conversation-header"]');
  if (header) {
    const titleEl =
      header.querySelector('[data-testid="conversation-info-header-chat-title"]') ||
      header.querySelector('[data-testid="conversation-info-header-chat-title"] span') ||
      header.querySelector('span[dir="auto"][title]');

    const title = titleEl?.getAttribute('title') || titleEl?.textContent?.trim();
    if (title) return `contact:${title}`;
  }

  return null;
}

function watchChatChanges(onChatChange) {
  let lastChatId = getCurrentChatId();

  const checkChat = () => {
    const chatId = getCurrentChatId();
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
