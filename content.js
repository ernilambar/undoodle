/**
 * Undoodle – Replaces Google Doodle with the original Google logo.
 */

(function () {
  'use strict';

  const LOGO_URL = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

  // Hide picture before first paint to avoid doodle flicker; show only after we replace.
  (function hidePictureEarly() {
    const style = document.createElement('style');
    style.id = 'undoodle-hide';
    style.textContent = 'picture { visibility: hidden !important; }';
    (document.documentElement || document.head).appendChild(style);
  })();

  function injectStyles() {
    if (document.getElementById('undoodle-styles')) return;
    const style = document.createElement('style');
    style.id = 'undoodle-styles';
    style.textContent = 'picture[data-undoodle="1"] { visibility: visible !important; display: block !important; max-width: 272px !important; } picture[data-undoodle="1"] img { max-width: 100% !important; height: auto !important; }';
    (document.head || document.documentElement).appendChild(style);
  }

  function run() {
    if (location.pathname !== '/' && !location.pathname.startsWith('/webhp')) return;

    const picture = document.querySelector('picture');
    if (!picture || picture.dataset.undoodle === '1') return;

    injectStyles();

    const img = document.createElement('img');
    img.src = LOGO_URL;
    img.alt = 'Google';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';

    picture.innerHTML = '';
    picture.appendChild(img);
    picture.style.display = 'block';
    picture.style.maxWidth = '272px';
    picture.dataset.undoodle = '1';

    const parent = picture.parentElement;
    if (parent && parent.tagName === 'A') {
      parent.parentNode.insertBefore(picture, parent);
      parent.remove();
    }

    let next = picture.nextElementSibling;
    while (next && next.tagName === 'DIV') {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }

    const parentDiv = picture.parentElement;
    if (parentDiv && parentDiv.tagName === 'DIV') {
      parentDiv.style.height = 'auto';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
