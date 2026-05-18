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
  { src: 'assets/fence2.webp', alt: 'Fence project — landscape and fence work by Blue Collar' },
  { src: 'assets/fence3.webp', alt: 'Completed fence installation' },
  { src: 'assets/fence4.webp', alt: 'Residential fence project' },
  { src: 'assets/fence5.webp', alt: 'Fence and yard project' },
  { src: 'assets/fence8.jpg', alt: 'Modern metal panel fence installation' },
  { src: 'assets/fence6.webp', alt: 'Privacy fence installation' },
  { src: 'assets/unnamed.jpg.webp', alt: 'Completed fence and landscape project' },
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

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulate async send (wire up to Formspree / EmailJS / backend as needed)
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1200);
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
