// =====================
// MODAL — open / close
// =====================
const modalOverlay = document.getElementById('modalOverlay');
const modalBox     = document.getElementById('modalBox');

function openModal(e) {
  if (e) e.preventDefault();
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = modalBox.querySelector('input, select');
    if (first) first.focus();
  }, 350);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Fecha ao clicar fora do box
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Fecha com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// =====================
// MÁSCARAS
// =====================
const whatsInput = document.getElementById('f-whats');
const instaInput = document.getElementById('f-insta');
const emailInput = document.getElementById('f-email');

// Máscara WhatsApp: (XX) XXXXX-XXXX
whatsInput.addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
  }
  this.value = v;
});

// @ automático no Instagram
instaInput.addEventListener('input', function () {
  let v = this.value;
  if (v.length > 0 && v[0] !== '@') {
    this.value = '@' + v.replace(/@/g, '');
  }
  if (v === '') this.value = '';
});
instaInput.addEventListener('focus', function () {
  if (this.value === '') this.value = '@';
});
instaInput.addEventListener('blur', function () {
  if (this.value === '@') this.value = '';
});

// =====================
// VALIDAÇÃO
// =====================
function showError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  field.classList.add('error');
  if (err) err.textContent = msg;
}
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  field.classList.remove('error');
  if (err) err.textContent = '';
}

// Limpa erro ao digitar
['f-nome','f-whats','f-email','f-insta','f-vendedores','f-faturamento'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, 'err-' + id.replace('f-','')));
});

function validateForm() {
  let ok = true;
  const nome     = document.getElementById('f-nome').value.trim();
  const whats    = document.getElementById('f-whats').value.replace(/\D/g,'');
  const email    = document.getElementById('f-email').value.trim();
  const vendas   = document.getElementById('f-vendedores').value;
  const fat      = document.getElementById('f-faturamento').value;

  if (nome.length < 3) {
    showError('f-nome', 'err-nome', 'Informe seu nome completo.'); ok = false;
  }
  if (whats.length < 10) {
    showError('f-whats', 'err-whats', 'Número inválido. Use (XX) XXXXX-XXXX.'); ok = false;
  }
  const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRgx.test(email)) {
    showError('f-email', 'err-email', 'E-mail inválido.'); ok = false;
  }
  if (!vendas) {
    showError('f-vendedores', 'err-vendedores', 'Selecione uma opção.'); ok = false;
  }
  if (!fat) {
    showError('f-faturamento', 'err-faturamento', 'Selecione uma opção.'); ok = false;
  }
  return ok;
}

// =====================
// ENVIO DO FORMULÁRIO
// =====================
// Substitua a URL abaixo pelo seu endpoint (Formspree, Make, N8n, etc.)
const FORM_ENDPOINT = 'https://formspree.io/f/SEU_ID_AQUI';

document.getElementById('modalForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('modalSubmitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  const payload = {
    nome:        document.getElementById('f-nome').value.trim(),
    whatsapp:    document.getElementById('f-whats').value.trim(),
    email:       document.getElementById('f-email').value.trim(),
    instagram:   document.getElementById('f-insta').value.trim(),
    vendedores:  document.getElementById('f-vendedores').value,
    faturamento: document.getElementById('f-faturamento').value,
  };

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      document.getElementById('modalForm').style.display = 'none';
      document.getElementById('modalSuccess').classList.add('show');
    } else {
      throw new Error('Erro no servidor');
    }
  } catch {
    // Fallback: abre WhatsApp com os dados preenchidos
    const msg = encodeURIComponent(
      `Olá! Quero meu diagnóstico gratuito.\n\nNome: ${payload.nome}\nWhatsApp: ${payload.whatsapp}\nE-mail: ${payload.email}\nInstagram: ${payload.instagram}\nVendedores: ${payload.vendedores}\nFaturamento: ${payload.faturamento}`
    );
    window.open(`https://wa.me/55SEUNUMERO?text=${msg}`, '_blank');
  } finally {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
});

// =====================
// SCROLL-DRIVEN VIDEO — Fundo seção Problema
// =====================
(function () {
  const video   = document.getElementById('funilVideo');
  const section = document.getElementById('problemaSection');
  if (!video || !section || window.innerWidth < 768) return;

  let rafId    = null;
  let lastTime = -1;
  let ready    = false;

  video.addEventListener('loadedmetadata', () => { ready = true; });
  setTimeout(() => { if (!ready && video.duration) ready = true; }, 800);

  function tick() {
    if (!ready || !video.duration) return;
    const rect      = section.getBoundingClientRect();
    const vpH       = window.innerHeight;
    const secH      = section.offsetHeight;
    // 0 quando a seção entra na tela, 1 quando sai pelo topo
    const scrolled  = -rect.top;
    const range     = secH + vpH;
    const progress  = Math.min(Math.max(scrolled / range + vpH / range, 0), 1);
    const target    = progress * video.duration;
    if (Math.abs(target - lastTime) > 0.012) {
      video.currentTime = target;
      lastTime = target;
    }
  }

  window.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }, { passive: true });
})();

// =====================
// NAVBAR SCROLL
// =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// =====================
// BOTÃO FLUTUANTE FIXO
// =====================
const stickyCta = document.getElementById('stickyCta');
const heroSection = document.getElementById('home');
const ctaFinal = document.getElementById('cta-final');

if (stickyCta && heroSection) {
  window.addEventListener('scroll', () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    const ctaTop = ctaFinal ? ctaFinal.getBoundingClientRect().top : Infinity;
    const show = heroBottom < 0 && ctaTop > window.innerHeight;
    stickyCta.classList.toggle('visible', show);
  }, { passive: true });
}

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
// REVEALS GENÉRICOS (reveal, fade-up, reveal-card)
// =====================
const revealEls = document.querySelectorAll('.reveal, .fade-up, .reveal-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.style.getPropertyValue('--delay')) || 0;
    el.classList.add('visible');
    setTimeout(() => el.style.removeProperty('--delay'), 800 + delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// =====================
// CONTADOR ANIMADO — hero stats
// =====================
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const nums = [
        { el: document.querySelectorAll('.hero-stat-num')[0], val: 100, suffix: '+' },
        { el: document.querySelectorAll('.hero-stat-num')[1], val: 3,   suffix: '+' },
        { el: document.querySelectorAll('.hero-stat-num')[2], val: 4400, suffix: '+' },
      ];
      nums.forEach(({ el, val, suffix }) => {
        if (el) animateCounter(el, val, suffix, 1400);
      });
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counterObserver.observe(statsSection);
}

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
// PILAR CARDS — tilt 3D + spotlight no hover
// =====================
const isMobile = () => window.innerWidth < 768;

document.querySelectorAll('.pilar-shell').forEach(shell => {
  shell.addEventListener('mousemove', e => {
    const rect = shell.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    shell.style.setProperty('--mx', x + '%');
    shell.style.setProperty('--my', y + '%');

    if (!isMobile()) {
      const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      shell.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  });
  shell.addEventListener('mouseleave', () => {
    shell.style.transform = '';
  });
});

// =====================
// FIT CARDS — tilt 3D suave
// =====================
document.querySelectorAll('.fit-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (isMobile()) return;
    const rect = card.getBoundingClientRect();
    const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
