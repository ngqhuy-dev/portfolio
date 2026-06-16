(function () {
  function enhanceCards(root) {
    root.querySelectorAll('.card:not(.fade-in)').forEach((card, index) => {
      card.classList.add('fade-in');
      card.style.animationDelay = Math.min(index * 40, 240) + 'ms';
    });
  }

  function enhanceProjectLinks(root) {
    root.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === '#') {
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
        link.classList.add('is-disabled');
        if (!link.textContent.includes('unavailable')) {
          link.textContent = link.textContent.trim() + ' unavailable';
        }
      }
    });
  }

  function enhance(root) {
    enhanceCards(root);
    enhanceProjectLinks(root);
  }

  enhance(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enhance(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
