(function() {
  'use strict';

  // State
  const state = {
    currentPostUrl: null,
    isPostOpen: false,
    cache: new Map(),
    theme: 'dark', // 'light' or 'dark'
    font: 'system',
    sidebarCollapsed: false,
    menuOpen: false
  };

  // DOM Elements
  const elements = {
    app: null,
    postList: null,
    contentPane: null,
    contentInner: null,
    backBtn: null,
    postItems: null,
    ellipsisBtn: null,
    contextMenu: null,
    collapseHandle: null
  };

  // Constants
  const THEME_KEY = 'notes-app-theme';
  const FONT_KEY = 'notes-app-font';
  const SIDEBAR_KEY = 'notes-app-sidebar-collapsed';

  // Initialize
  function init() {
    elements.app = document.getElementById('notes-app');
    if (!elements.app) return;

    elements.postList = document.getElementById('post-list');
    elements.contentPane = document.getElementById('content-pane');
    elements.contentInner = document.getElementById('post-content');
    elements.backBtn = document.getElementById('back-btn');
    elements.postItems = document.querySelectorAll('.notes-app__post-item');
    elements.ellipsisBtn = document.getElementById('ellipsis-btn');
    elements.contextMenu = document.getElementById('context-menu');
    elements.collapseHandle = document.getElementById('sidebar-collapse-handle');

    initTheme();
    initFont();
    initSidebar();
    bindEvents();
    handleInitialLoad();
  }

  // Initialize sidebar state from localStorage
  function initSidebar() {
    var savedState = localStorage.getItem(SIDEBAR_KEY);
    if (savedState === 'true') {
      state.sidebarCollapsed = true;
      elements.app.classList.add('sidebar-collapsed');
    }
  }

  // Toggle sidebar collapsed state
  function toggleSidebar() {
    state.sidebarCollapsed = !state.sidebarCollapsed;

    if (state.sidebarCollapsed) {
      elements.app.classList.add('sidebar-collapsed');
    } else {
      elements.app.classList.remove('sidebar-collapsed');
    }

    localStorage.setItem(SIDEBAR_KEY, state.sidebarCollapsed);
  }

  // Initialize theme from localStorage or system preference
  function initTheme() {
    var savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme) {
      // Migrate old themes to new light/dark system
      if (savedTheme === 'sepia' || savedTheme === 'light') {
        savedTheme = 'light';
      } else {
        savedTheme = 'dark';
      }
    } else {
      // No saved theme - respect system preference
      savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(savedTheme);
    updateThemeButtons();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only auto-switch if user hasn't explicitly set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Set theme
  function setTheme(theme) {
    state.theme = theme;

    // Remove all theme classes
    elements.app.classList.remove('notes-app--light', 'notes-app--dark');

    // Add the selected theme class
    if (theme === 'light') {
      elements.app.classList.add('notes-app--light');
    } else {
      elements.app.classList.add('notes-app--dark');
    }

    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtons();
    updateThemeColor(theme);
  }

  // Update mobile status bar color (theme-color meta tag)
  function updateThemeColor(theme) {
    var color = theme === 'light' ? '#ffffff' : '#1c1c1e';
    var metaTags = document.querySelectorAll('meta[name="theme-color"]');
    metaTags.forEach(function(meta) {
      meta.setAttribute('content', color);
    });
  }

  // Update theme button selection state
  function updateThemeButtons() {
    var themeBtns = document.querySelectorAll('.context-menu__theme-btn');
    themeBtns.forEach(function(btn) {
      if (btn.dataset.theme === state.theme) {
        btn.classList.add('is-selected');
      } else {
        btn.classList.remove('is-selected');
      }
    });
  }

  // Initialize font from localStorage
  function initFont() {
    var savedFont = localStorage.getItem(FONT_KEY) || 'system';
    setFont(savedFont);
    updateFontButtons();
  }

  // Set font
  function setFont(font) {
    state.font = font;

    // Remove all font classes
    elements.app.classList.remove('font-system', 'font-georgia', 'font-charter', 'font-palatino', 'font-times', 'font-ia-writer');

    // Add the selected font class
    elements.app.classList.add('font-' + font);

    localStorage.setItem(FONT_KEY, font);
    updateFontButtons();
  }

  // Update font button selection state
  function updateFontButtons() {
    var fontBtns = document.querySelectorAll('.context-menu__font-btn');
    fontBtns.forEach(function(btn) {
      if (btn.dataset.font === state.font) {
        btn.classList.add('is-selected');
      } else {
        btn.classList.remove('is-selected');
      }
    });
  }

  // Toggle context menu
  function toggleMenu() {
    state.menuOpen = !state.menuOpen;
    if (state.menuOpen) {
      elements.contextMenu.classList.add('is-open');
    } else {
      elements.contextMenu.classList.remove('is-open');
    }
  }

  // Close context menu
  function closeMenu() {
    state.menuOpen = false;
    if (elements.contextMenu) {
      elements.contextMenu.classList.remove('is-open');
    }
  }

  // Bind events
  function bindEvents() {
    // Post item clicks
    elements.postItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var url = item.dataset.url;
        loadPost(url, item);
      });

      // Keyboard support for accessibility
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var url = item.dataset.url;
          loadPost(url, item);
        }
      });
    });

    // Back button (mobile)
    if (elements.backBtn) {
      elements.backBtn.addEventListener('click', closePost);
    }

    // Ellipsis button / context menu
    if (elements.ellipsisBtn) {
      elements.ellipsisBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
    }

    // Theme buttons in context menu
    var themeBtns = document.querySelectorAll('.context-menu__theme-btn');
    themeBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        setTheme(btn.dataset.theme);
      });
    });

    // Font buttons in context menu
    var fontBtns = document.querySelectorAll('.context-menu__font-btn');
    fontBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        setFont(btn.dataset.font);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (state.menuOpen && !elements.contextMenu.contains(e.target) && e.target !== elements.ellipsisBtn) {
        closeMenu();
      }
    });

    // Sidebar collapse handle
    if (elements.collapseHandle) {
      elements.collapseHandle.addEventListener('click', toggleSidebar);
    }

    // Browser navigation
    window.addEventListener('popstate', handlePopState);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
  }

  // Handle initial page load (direct links to posts)
  function handleInitialLoad() {
    var path = window.location.pathname;

    // Check if we're on a post URL
    var matchingItem = null;
    for (var i = 0; i < elements.postItems.length; i++) {
      var item = elements.postItems[i];
      var itemUrl = item.dataset.url;
      if (path === itemUrl || path === itemUrl + '/' || path + '/' === itemUrl) {
        matchingItem = item;
        break;
      }
    }

    if (matchingItem) {
      loadPost(matchingItem.dataset.url, matchingItem, false);
    } else if (window.innerWidth > 768 && elements.postItems.length > 0) {
      // Load first post on desktop
      var firstItem = elements.postItems[0];
      loadPost(firstItem.dataset.url, firstItem, false);
    }
  }

  // Load post content
  function loadPost(url, item, pushState) {
    if (pushState === undefined) pushState = true;

    // Update selection
    elements.postItems.forEach(function(el) {
      el.classList.remove('is-selected');
    });
    item.classList.add('is-selected');

    // Update URL
    if (pushState && url !== window.location.pathname) {
      history.pushState({ postUrl: url }, '', url);
    }

    // Show loading state
    elements.contentInner.innerHTML = '<div class="notes-app__loading"></div>';

    // Mobile: show content pane
    elements.app.classList.add('notes-app--post-open');
    state.isPostOpen = true;
    state.currentPostUrl = url;

    // Check cache
    if (state.cache.has(url)) {
      displayContent(state.cache.get(url));
      return;
    }

    // Fetch content
    fetch(url)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to load post');
        }
        return response.text();
      })
      .then(function(html) {
        // Parse HTML and extract article
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var article = doc.querySelector('.c-article');
        var content = article ? article.outerHTML : '<p>Post not found</p>';

        // Cache the content
        state.cache.set(url, content);

        displayContent(content);
      })
      .catch(function(error) {
        console.error('Failed to load post:', error);
        elements.contentInner.innerHTML =
          '<div class="notes-app__error">' +
          '<p>Failed to load post. <a href="' + url + '">View directly</a></p>' +
          '</div>';
      });
  }

  // Display content in the pane
  function displayContent(content) {
    elements.contentInner.innerHTML = content;

    // Scroll to top of content
    elements.contentPane.scrollTop = 0;

    // Re-apply syntax highlighting if Prism is available
    if (window.Prism) {
      Prism.highlightAllUnder(elements.contentInner);
    }
  }

  // Close post (mobile)
  function closePost() {
    elements.app.classList.remove('notes-app--post-open');
    state.isPostOpen = false;

    // Update URL to home
    history.pushState({ postUrl: null }, '', '/');

    // Clear selection on mobile
    if (window.innerWidth <= 768) {
      elements.postItems.forEach(function(el) {
        el.classList.remove('is-selected');
      });
    }
  }

  // Handle browser back/forward
  function handlePopState(event) {
    if (event.state && event.state.postUrl) {
      var matchingItem = null;
      for (var i = 0; i < elements.postItems.length; i++) {
        if (elements.postItems[i].dataset.url === event.state.postUrl) {
          matchingItem = elements.postItems[i];
          break;
        }
      }
      if (matchingItem) {
        loadPost(event.state.postUrl, matchingItem, false);
      }
    } else {
      // Going back to list
      elements.app.classList.remove('notes-app--post-open');
      elements.postItems.forEach(function(el) {
        el.classList.remove('is-selected');
      });
      state.isPostOpen = false;
      state.currentPostUrl = null;

      // Show welcome message
      elements.contentInner.innerHTML =
        '<div class="notes-app__welcome">' +
        '<h2>Welcome</h2>' +
        '<p>Select a post from the sidebar to read.</p>' +
        '</div>';
    }
  }

  // Keyboard navigation
  function handleKeyboard(event) {
    if (!elements.postItems.length) return;

    // Don't handle if user is typing in an input
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    var currentIndex = -1;
    for (var i = 0; i < elements.postItems.length; i++) {
      if (elements.postItems[i].classList.contains('is-selected')) {
        currentIndex = i;
        break;
      }
    }

    var newIndex;

    switch (event.key) {
      case 'ArrowUp':
      case 'k':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : elements.postItems.length - 1;
        break;
      case 'ArrowDown':
      case 'j':
        event.preventDefault();
        newIndex = currentIndex < elements.postItems.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Escape':
        if (state.menuOpen) {
          closeMenu();
          return;
        }
        if (state.isPostOpen && window.innerWidth <= 768) {
          closePost();
        }
        return;
      case '[':
        // Toggle sidebar
        if (window.innerWidth > 768) {
          toggleSidebar();
        }
        return;
      default:
        return;
    }

    var item = elements.postItems[newIndex];
    loadPost(item.dataset.url, item);
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
