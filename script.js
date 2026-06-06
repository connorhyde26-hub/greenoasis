/* ── NAVBAR: scroll state + active link highlighting ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateNav() {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);

  // Highlight active nav link based on scroll position
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL via IntersectionObserver ── */
const revealEls = document.querySelectorAll('.reveal');
const isEmbedded =
  window.self !== window.top ||
  new URLSearchParams(window.location.search).has('embed');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: isEmbedded ? 0.01 : 0.12,
    rootMargin: isEmbedded ? '0px' : '0px 0px -40px 0px',
  }
);

function revealIfInView(el) {
  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    el.classList.add('visible');
    revealObserver.unobserve(el);
    return true;
  }
  return false;
}

revealEls.forEach(el => {
  revealIfInView(el);
  revealObserver.observe(el);
});

function refreshReveals() {
  revealEls.forEach(el => revealIfInView(el));
}

window.addEventListener('load', refreshReveals);
requestAnimationFrame(() => requestAnimationFrame(refreshReveals));

if (isEmbedded) {
  document.querySelectorAll('#hero .reveal').forEach(el => {
    el.classList.add('visible');
    revealObserver.unobserve(el);
  });
}

/* ── ANIMATED COUNTERS ── */
const counters = document.querySelectorAll('.count');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const tick = () => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach(animateCounter);
}

const heroSection = document.getElementById('hero');
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounters();
        counterObserver.disconnect();
      }
    });
  },
  { threshold: isEmbedded ? 0.1 : 0.5 }
);

if (heroSection) {
  counterObserver.observe(heroSection);
  if (isEmbedded) {
    const heroRect = heroSection.getBoundingClientRect();
    if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
      startCounters();
      counterObserver.disconnect();
    }
  }
}

/* ── GALLERY LIGHTBOX ── */
const galleryImages = [
  { src: 'assets/gallery-photos/gallery-00.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-01.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-02.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-03.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-04.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-05.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-06.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-07.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-08.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-09.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-10.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-11.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-12.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-13.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-14.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-15.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-16.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-17.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-18.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-19.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-20.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-21.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-22.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-23.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-24.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-25.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-26.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-27.jpg', alt: 'Green Oasis lawn care project' },
  { src: 'assets/gallery-photos/gallery-28.jpg', alt: 'Green Oasis lawn care project' },
];

const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const img = galleryImages[currentIdx];
  lbImg.src = img.src;
  lbImg.alt = img.alt;
}

function changeLightbox(dir) {
  currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
  showLightboxImage();
}

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => openLightbox(Number(item.dataset.idx)));
});

const galleryViewMore = document.getElementById('galleryViewMore');
if (galleryViewMore) {
  galleryViewMore.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const startIdx = galleryImages.findIndex(img => img.src.endsWith('gallery-10.jpg'));
    requestAnimationFrame(() => openLightbox(startIdx >= 0 ? startIdx : 10));
  });
}
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', e => { e.stopPropagation(); changeLightbox(-1); });
lbNext.addEventListener('click', e => { e.stopPropagation(); changeLightbox(1); });

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeLightbox(-1);
  if (e.key === 'ArrowRight') changeLightbox(1);
});

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const defaultLabel = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } else {
      const data = await response.json().catch(() => ({}));
      alert(data.error || 'Something went wrong. Please try again or call (801) 200-0184.');
    }
  } catch {
    alert('Could not send your message. Please try again or call (801) 200-0184.');
  } finally {
    btn.textContent = defaultLabel;
    btn.disabled = false;
  }
});

/* ── REVIEW SEE MORE ── */
document.querySelectorAll('.review-body').forEach(body => {
  const text = body.querySelector('.review-text');
  const toggle = body.querySelector('.review-toggle');
  if (!text || !toggle) return;

  text.classList.add('is-clamped');

  const syncToggle = () => {
    if (!text.classList.contains('is-clamped')) {
      toggle.hidden = false;
      toggle.textContent = 'See less';
      return;
    }

    const overflowing = text.scrollHeight > text.clientHeight + 1;
    if (overflowing) {
      toggle.hidden = false;
      toggle.textContent = 'See more';
    } else {
      text.classList.remove('is-clamped');
      toggle.hidden = true;
    }
  };

  syncToggle();
  window.addEventListener('resize', syncToggle);

  toggle.addEventListener('click', () => {
    text.classList.toggle('is-clamped');
    toggle.textContent = text.classList.contains('is-clamped') ? 'See more' : 'See less';
  });
});
