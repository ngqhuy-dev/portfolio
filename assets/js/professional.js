(function () {
  function enhanceCards(root) {
    root.querySelectorAll('.card:not(.fade-in)').forEach(function (card, index) {
      card.classList.add('fade-in');
      card.style.animationDelay = Math.min(index * 40, 240) + 'ms';
    });
  }

  function enhanceProjectLinks(root) {
    root.querySelectorAll('a').forEach(function (link) {
      if (link.textContent.trim() === 'GitHub') {
        link.textContent = 'Source';
      }

      if (link.getAttribute('href') === '#') {
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
        link.classList.add('is-disabled');
        link.textContent = link.textContent.trim() + ' unavailable';
      }
    });
  }

  function enhance(root) {
    enhanceCards(root);
    enhanceProjectLinks(root);
  }

  enhance(document);

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          enhance(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
