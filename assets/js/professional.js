(function () {
  function enhanceCards(root) {
    const cards = Array.from(root.querySelectorAll('.card:not(.fade-in)'));
    if (root.matches && root.matches('.card:not(.fade-in)')) cards.unshift(root);
    cards.forEach((card, index) => {
      card.classList.add('fade-in');
      card.style.animationDelay = Math.min(index * 40, 240) + 'ms';
    });
  }

  enhanceCards(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) enhanceCards(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
