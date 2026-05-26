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
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ── ANIMATED COUNTERS ── */
const counters = document.querySelectorAll('.count');

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

const heroSection = document.getElementById('hero');
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        counterObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);
counterObserver.observe(heroSection);

/* ── GALLERY LIGHTBOX ── */
const galleryImages = [
  { src: 'assets/gallery-suburban-lawn-mountains.png', alt: 'Professionally mowed suburban lawn' },
  { src: 'assets/gallery-street-lawn-mowing-stripes.png', alt: 'Lawn with professional mowing stripes' },
  { src: 'assets/gallery-side-yard-mowed-lawn.png', alt: 'Mowed side yard lawn' },
  { src: 'assets/gallery-backyard-mowing-stripes.png', alt: 'Backyard lawn with mowing stripes' },
  { src: 'assets/gallery-tudor-home-lawn.png', alt: 'Residential lawn in front of Tudor-style home' },
  { src: 'assets/gallery-modern-homes-lawn-stripes.png', alt: 'Manicured lawn between modern homes' },
  { src: 'assets/gallery-brick-home-front-lawn.png', alt: 'Front lawn with mowing stripes at brick home' },
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

document.querySelectorAll('.gallery-item').forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});
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
