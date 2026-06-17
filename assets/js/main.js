(function () {
  /* ── Hamburger menu ── */
  (function setupHamburger() {
    const nav = document.querySelector('header .nav');
    if (!nav) return;

    const ham = document.createElement('button');
    ham.className = 'hamburger';
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
      if (e.key === 'Escape') closeMenu();
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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('header nav a, .mobile-menu a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === currentPage) {
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

  function getParam(name) {
    return new URL(window.location.href).searchParams.get(name);
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

  /* ── Project card (XSS-safe via DOM API) ── */
  function createProjectCard(p) {
    const img = el('img', {
      src: p.image,
      alt: p.title,
      loading: 'lazy',
      decoding: 'async',
      width: '800',
    });
    const imgLink = el('a', { href: 'project.html?id=' + p.id, className: 'project-card-img-wrap' }, [img]);

    const meta = el('div', { className: 'meta', textContent: p.category.toUpperCase() + ' • ' + p.date });
    const titleLink = el('a', { href: 'project.html?id=' + p.id, textContent: p.title });
    const h3 = el('h3', null, [titleLink]);
    const summary = el('p', { className: 'project-summary', textContent: p.summary });
    const badges = badgeList(p.technologies);

    const body = el('div', { className: 'project-card-body' }, [meta, h3, summary, badges]);
    const article = el('article', { className: 'card project-card' }, [imgLink, body]);
    return article;
  }

  /* ── Post card (XSS-safe) ── */
  function createPostCard(post) {
    const img = el('img', {
      src: post.hero,
      alt: post.title,
      loading: 'lazy',
      decoding: 'async',
    });
    const imgLink = el('a', { href: 'post.html?id=' + post.id }, [img]);

    const titleLink = el('a', { href: 'post.html?id=' + post.id, textContent: post.title });
    const h3 = el('h3', null, [titleLink]);

    const tagSpans = post.tags.map((t) => el('span', { className: 'tag', textContent: '#' + t }));
    const meta = el('div', { className: 'meta' });
    meta.appendChild(txt(post.date + ' • '));
    tagSpans.forEach((s) => { meta.appendChild(s); meta.appendChild(txt(' ')); });

    const excerpt = el('p', { textContent: post.excerpt });

    return el('article', { className: 'card post-card' }, [imgLink, h3, meta, excerpt]);
  }

  /* ── Home: featured projects ── */
  const featuredEl = document.getElementById('featured-projects');
  if (featuredEl) {
    loadJSON('assets/data/projects.json').then((data) => {
      data.slice(0, 3).forEach((p) => featuredEl.appendChild(createProjectCard(p)));
    });
  }

  /* ── Portfolio: project list + filter ── */
  const projectListEl = document.getElementById('project-list');
  if (projectListEl) {
    let allProjects = [];

    function renderProjects(items) {
      projectListEl.innerHTML = '';
      items.forEach((p) => projectListEl.appendChild(createProjectCard(p)));
    }

    loadJSON('assets/data/projects.json').then((data) => {
      allProjects = data;
      renderProjects(allProjects);
    });

    document.querySelectorAll('.filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach((b) => {
          b.classList.remove('active');
          b.removeAttribute('aria-pressed');
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

  /* ── Project detail ── */
  const projectEl = document.getElementById('project');
  if (projectEl) {
    const id = parseInt(getParam('id'), 10);
    loadJSON('assets/data/projects.json').then((data) => {
      const proj = data.find((p) => p.id === id) || data[0];

      const h1 = el('h1', { textContent: proj.title });
      const meta = el('div', {
        className: 'meta',
        textContent: proj.category.toUpperCase() + ' • ' + proj.date,
      });
      const badges = badgeList(proj.technologies);
      badges.style.margin = '8px 0';

      const summary = el('p', { textContent: proj.summary });

      const ghBtn = el('a', {
        className: 'btn',
        href: proj.github,
        target: '_blank',
        rel: 'noopener',
        textContent: 'Source',
      });
      const liveBtn = el('a', {
        className: 'btn primary',
        href: proj.live,
        target: '_blank',
        rel: 'noopener',
        textContent: 'Live',
      });
      const actions = el('div', { className: 'project-actions' }, [ghBtn, liveBtn]);

      const heroLeft = el('div', null, [h1, meta, badges, summary, actions]);

      const heroImg = el('img', {
        src: proj.image,
        alt: proj.title,
        loading: 'eager',
        decoding: 'async',
        width: '800',
        height: '500',
      });
      const heroRight = el('div', null, [heroImg]);

      const hero = el('div', { className: 'project-hero' }, [heroLeft, heroRight]);
      const hr = el('hr');

      const gallery = el('div', { className: 'gallery' });
      proj.images.forEach((src, i) => {
        gallery.appendChild(el('img', {
          src,
          alt: proj.title + ' screenshot ' + (i + 1),
          loading: 'lazy',
          decoding: 'async',
        }));
      });

      const body = el('section', { className: 'post-body' });
      proj.content.forEach((p) => body.appendChild(el('p', { textContent: p })));

      projectEl.append(hero, hr, gallery, body);
    });
  }

  /* ── Blog: post list + search ── */
  const postListEl = document.getElementById('post-list');
  if (postListEl) {
    let allPosts = [];

    function renderPosts(items) {
      postListEl.innerHTML = '';
      items.forEach((post) => postListEl.appendChild(createPostCard(post)));
    }

    loadJSON('assets/data/posts.json').then((data) => {
      allPosts = data;
      renderPosts(allPosts);
    });

    const searchEl = document.getElementById('search');
    if (searchEl) {
      searchEl.addEventListener('input', () => {
        const q = searchEl.value.toLowerCase();
        renderPosts(
          allPosts.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          )
        );
      });
    }
  }

  /* ── Post detail ── */
  const postEl = document.getElementById('post');
  if (postEl) {
    const id = parseInt(getParam('id'), 10);
    loadJSON('assets/data/posts.json').then((data) => {
      const post = data.find((p) => p.id === id) || data[0];

      const img = el('img', {
        src: post.hero,
        alt: post.title,
        loading: 'eager',
        decoding: 'async',
      });
      const h1 = el('h1', { textContent: post.title });
      const tagSpans = post.tags.map((t) => el('span', { className: 'tag', textContent: '#' + t }));
      const meta = el('div', { className: 'meta' });
      meta.appendChild(txt(post.date + ' • ' + post.author + ' • '));
      tagSpans.forEach((s) => { meta.appendChild(s); meta.appendChild(txt(' ')); });

      const postHeader = el('header', { className: 'post-hero' }, [img, h1, meta]);

      const body = el('section', { className: 'post-body' });
      post.content.forEach((p) => body.appendChild(el('p', { textContent: p })));

      postEl.append(postHeader, body);
    });
  }

  /* ── Testimonials ── */
  const testimonialEl = document.getElementById('testimonials');
  if (testimonialEl) {
    loadJSON('assets/data/testimonials.json').then((data) => {
      data.forEach((t) => {
        const avatar = el('img', {
          className: 'avatar',
          src: t.avatar,
          alt: t.name,
          loading: 'lazy',
          decoding: 'async',
          width: '48',
          height: '48',
        });
        const name = el('strong', { textContent: t.name + ' • ' + t.role + ', ' + t.company });
        const quote = el('p', { className: 'quote', textContent: '"' + t.quote + '"' });
        const info = el('div', null, [name, quote]);
        const card = el('div', { className: 'card testimonial' }, [avatar, info]);
        testimonialEl.appendChild(card);
      });
    });
  }

  /* ── Contact form (Formspree) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const successEl = document.getElementById('success');
      const errorEl = document.getElementById('error');

      successEl.style.display = 'none';
      errorEl.style.display = 'none';

      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const msg = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !msg) {
        errorEl.style.display = 'block';
        return;
      }

      const action = contactForm.getAttribute('action');

      // If no Formspree action configured, fall back to mailto guidance
      if (!action || action === '#') {
        successEl.style.display = 'block';
        contactForm.reset();
        return;
      }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          successEl.style.display = 'block';
          contactForm.reset();
        } else {
          errorEl.style.display = 'block';
        }
      } catch {
        errorEl.style.display = 'block';
      }
    });
  }
})();
