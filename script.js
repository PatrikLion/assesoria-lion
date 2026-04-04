// =====================
// NAVBAR SCROLL
// =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// =====================
// PILAR SHELLS — observer com remoção de delay após reveal
// =====================
const pilarShells = document.querySelectorAll('.pilar-shell');

const pilarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.style.getPropertyValue('--delay')) || 0;
    el.classList.add('visible');
    setTimeout(() => el.style.removeProperty('--delay'), 750 + delay);
    pilarObserver.unobserve(el);
  });
}, { threshold: 0.15 });

pilarShells.forEach(el => pilarObserver.observe(el));

// =====================
// REVEALS GENÉRICOS
// =====================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.style.getPropertyValue('--delay')) || 0;
    el.classList.add('visible');
    setTimeout(() => el.style.removeProperty('--delay'), 700 + delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// =====================
// HERO STATS — animação de entrada
// =====================
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  heroStats.style.opacity = '0';
  heroStats.style.transform = 'translateY(20px)';
  heroStats.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s';
  heroObserver.observe(heroStats);
}

// =====================
// FAQ ACCORDION
// =====================
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// =====================
// SMOOTH ANCHOR SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const selector = a.getAttribute('href');
    if (selector === '#') return;
    const target = document.querySelector(selector);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =====================
// DEPOIMENTOS — pausa no hover/touch
// =====================
const depTrack = document.getElementById('depTrack1');
if (depTrack) {
  depTrack.addEventListener('mouseenter',  () => depTrack.style.animationPlayState = 'paused');
  depTrack.addEventListener('mouseleave',  () => depTrack.style.animationPlayState = 'running');
  depTrack.addEventListener('touchstart',  () => depTrack.style.animationPlayState = 'paused', { passive: true });
  depTrack.addEventListener('touchend',    () => depTrack.style.animationPlayState = 'running', { passive: true });
}

// =====================
// PILAR CARDS — efeito spotlight no hover (CSS variable mouse pos)
// =====================
document.querySelectorAll('.pilar-shell').forEach(shell => {
  shell.addEventListener('mousemove', e => {
    const rect = shell.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    shell.style.setProperty('--mx', x + '%');
    shell.style.setProperty('--my', y + '%');
  });
});
