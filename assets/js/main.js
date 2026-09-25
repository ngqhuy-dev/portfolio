(function () {
  /* ── Hamburger menu ── */
  (function setupHamburger() {
    const nav = document.querySelector('header .nav');
    if (!nav) return;

    const ham = document.createElement('button');
    ham.type = 'button';
    ham.className = 'hamburger';
    ham.setAttribute('aria-controls', 'mobile-menu');
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-label', 'Toggle menu');
    ham.textContent = '☰';
    nav.appendChild(ham);

    const desktopList = document.querySelector('header nav ul');
    const mobileWrap = document.getElementById('mobile-menu');
    if (desktopList && mobileWrap) {
      mobileWrap.appendChild(desktopList.cloneNode(true));
    }

    function openMenu() {
      mobileWrap.classList.add('open');
      ham.setAttribute('aria-expanded', 'true');
      ham.textContent = '✕';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileWrap.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      ham.textContent = '☰';
      document.body.style.overflow = '';
    }

    ham.addEventListener('click', () => {
      ham.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    mobileWrap.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !mobileWrap.classList.contains('open')) return;
      closeMenu();
      ham.focus();
    });

    document.addEventListener('click', (e) => {
      if (
        mobileWrap.classList.contains('open') &&
        !mobileWrap.contains(e.target) &&
        !ham.contains(e.target)
      ) closeMenu();
    });
  })();

  /* ── Footer year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Active nav: set aria-current dynamically ── */
  // Treat "/about", "/about/" and "/about.html" as the same route
  function routeOf(pathname) {
    const route = pathname.replace(/\/+$/, '').replace(/\.html$/, '').replace(/\/index$/, '');
    return route || '/';
  }

  const currentRoute = routeOf(window.location.pathname);

  document.querySelectorAll('header nav a, .mobile-menu a').forEach((a) => {
    if (routeOf(a.pathname) === currentRoute) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });

  /* ── Helpers ── */
  function loadJSON(url) {
    return fetch(url).then((r) => {
      if (!r.ok) throw new Error('Failed to load ' + url);
      return r.json();
    });
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'textContent') node.textContent = v;
      else node.setAttribute(k, v);
    });
    if (children) children.forEach((c) => c && node.appendChild(c));
    return node;
  }

  function txt(text) { return document.createTextNode(text); }

  function badgeList(items) {
    const wrap = el('div');
    items.forEach((t) => {
      const b = el('span', { className: 'badge', textContent: t });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function renderLoadError(container) {
    container.innerHTML = '';
    const message = el('p', { className: 'load-error', role: 'alert' });
    message.appendChild(txt('Projects could not be loaded. Please refresh, or see the '));
    message.appendChild(el('a', { href: 'resume', textContent: 'resume' }));
    message.appendChild(txt(' for the full list.'));
    container.appendChild(message);
  }

  function hasPublicLink(url) {
    return Boolean(url) && url !== '#';
  }

  function projectInitials(title) {
    return title
      .split(/[\s—-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  }

  // Decorative cover — no remote image dependency, tinted by the project's accent color
  function createProjectCover(p) {
    const cover = el('div', { className: 'project-cover', 'aria-hidden': 'true' }, [
      el('span', { className: 'project-cover-label', textContent: '~/' + p.category }),
      el('span', { className: 'project-cover-mark', textContent: projectInitials(p.title) }),
    ]);
    if (p.accent) cover.style.setProperty('--project-accent', p.accent);
    return cover;
  }

  function createProjectLink(p) {
    if (!hasPublicLink(p.github)) {
      return el('span', { className: 'project-private', textContent: 'Private repository' });
    }
    return el('a', {
      className: 'project-link',
      href: p.github,
      target: '_blank',
      rel: 'noopener noreferrer',
      textContent: 'Source ↗',
      'aria-label': p.title + ' source code (opens in a new tab)',
    });
  }

  /* ── Project card (XSS-safe via DOM API) ── */
  function createProjectCard(p) {
    const meta = el('div', { className: 'meta', textContent: p.category.toUpperCase() + ' • ' + p.date });
    const h3 = el('h3', { textContent: p.title });
    const summary = el('p', { className: 'project-summary', textContent: p.summary });
    const badges = badgeList(p.technologies);
    badges.className = 'project-badges';
    const footer = el('div', { className: 'project-card-footer' }, [createProjectLink(p)]);

    const body = el('div', { className: 'project-card-body' }, [meta, h3, summary, badges, footer]);
    return el('article', { className: 'card project-card' }, [createProjectCover(p), body]);
  }

  /* ── Home: featured projects ── */
  const featuredEl = document.getElementById('featured-projects');
  if (featuredEl) {
    loadJSON('assets/data/projects.json')
      .then((data) => {
        data.slice(0, 3).forEach((p) => featuredEl.appendChild(createProjectCard(p)));
      })
      .catch(() => renderLoadError(featuredEl));
  }

  /* ── Portfolio: project list + filter ── */
  const projectListEl = document.getElementById('project-list');
  if (projectListEl) {
    let allProjects = [];

    function renderProjects(items) {
      projectListEl.innerHTML = '';
      items.forEach((p) => projectListEl.appendChild(createProjectCard(p)));
    }

    loadJSON('assets/data/projects.json')
      .then((data) => {
        allProjects = data;
        renderProjects(allProjects);
      })
      .catch(() => renderLoadError(projectListEl));

    document.querySelectorAll('.filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const type = btn.dataset.filter;
        renderProjects(type === 'all' ? allProjects : allProjects.filter((p) => p.category === type));
      });
    });

    // Initial active state
    const initialActive = document.querySelector('.filter.active');
    if (initialActive) initialActive.setAttribute('aria-pressed', 'true');
  }

  /* ── Contact form (Formspree, falls back to the visitor's mail app) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const CONTACT_EMAIL = contactForm.dataset.mailto;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const successEl = document.getElementById('success');
    const handoffEl = document.getElementById('handoff');
    const errorEl = document.getElementById('error');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const fields = {
      name: contactForm.querySelector('#name'),
      email: contactForm.querySelector('#email'),
      message: contactForm.querySelector('#message'),
    };

    function hideStatus() {
      [successEl, handoffEl, errorEl].forEach((node) => { node.style.display = 'none'; });
      Object.values(fields).forEach((input) => input.removeAttribute('aria-invalid'));
    }

    function showError(message, invalidInput) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      if (invalidInput) {
        invalidInput.setAttribute('aria-invalid', 'true');
        invalidInput.focus();
      }
    }

    function setSending(isSending) {
      submitBtn.disabled = isSending;
      contactForm.setAttribute('aria-busy', String(isSending));
    }

    function openMailApp(name, email, message) {
      const subject = 'Portfolio contact from ' + name;
      const body = message + '\n\n— ' + name + ' <' + email + '>';
      window.location.href = 'mailto:' + CONTACT_EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideStatus();

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const message = fields.message.value.trim();
      const emptyField = [fields.name, fields.email, fields.message].find((input) => !input.value.trim());

      if (emptyField) {
        showError('Please fill in all fields.', emptyField);
        return;
      }
      if (!EMAIL_PATTERN.test(email)) {
        showError('Please enter a valid email address.', fields.email);
        return;
      }

      const honeypot = contactForm.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      const action = contactForm.getAttribute('action');
      if (!action || action === '#') {
        openMailApp(name, email, message);
        handoffEl.style.display = 'block';
        return;
      }

      setSending(true);
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Request failed with status ' + res.status);
        successEl.style.display = 'block';
        contactForm.reset();
      } catch {
        showError('Message could not be sent. Please email me directly at ' + CONTACT_EMAIL + '.');
      } finally {
        setSending(false);
      }
    });
  }
})();
