// =====================
// MODAL — open / close
// =====================
const modalOverlay = document.getElementById('modalOverlay');
const modalBox     = document.getElementById('modalBox');

let _modalOpenedAt = 0;

function openModal(e) {
  if (e) e.preventDefault();
  _modalOpenedAt = Date.now();
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = document.getElementById('f-vendedores');
    if (first) first.focus();
  }, 350);
  // Meta Pixel: Ver conteúdo ao abrir o modal
  if (typeof fbq === 'function') {
    fbq('track', 'ViewContent', { content_name: 'Diagnóstico Gratuito' });
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  const form    = document.getElementById('modalForm');
  const success = document.getElementById('modalSuccess');
  if (form) {
    form.style.display = '';
    form.reset();
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    // Reseta radio buttons
    form.querySelectorAll('input[name="momento"]').forEach(r => r.checked = false);
    // Reseta instagram
    const insta = document.getElementById('f-insta');
    if (insta) insta.value = '';
    // Reseta etapas
    document.getElementById('formStep1').hidden = false;
    document.getElementById('formStep2').hidden = true;
    document.getElementById('formStep3').hidden = true;
    document.getElementById('stepDot1').className = 'step-dot active';
    document.getElementById('stepDot2').className = 'step-dot';
    document.getElementById('stepDot3').className = 'step-dot';
  }
  if (success) success.classList.remove('show');
  const edu = document.getElementById('modalEducativo');
  if (edu) edu.classList.remove('show');
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

// =====================
// NAVEGAÇÃO DE ETAPAS
// =====================

// Etapa 1 → 2 (valida apenas os selects)
document.getElementById('btnStep1Next').addEventListener('click', () => {
  const vendas = document.getElementById('f-vendedores').value;
  const fat    = document.getElementById('f-faturamento').value;
  let ok = true;
  if (!vendas) { showError('f-vendedores', 'err-vendedores', 'Selecione uma opção.'); ok = false; }
  if (!fat)    { showError('f-faturamento', 'err-faturamento', 'Selecione uma opção.'); ok = false; }
  if (!ok) return;
  document.getElementById('formStep1').hidden = true;
  document.getElementById('formStep2').hidden = false;
  document.getElementById('stepDot1').className = 'step-dot done';
  document.getElementById('stepDot2').className = 'step-dot active';
});

// Etapa 2 → 1 (voltar)
document.getElementById('btnStep2Back').addEventListener('click', () => {
  document.getElementById('formStep2').hidden = true;
  document.getElementById('formStep1').hidden = false;
  document.getElementById('stepDot1').className = 'step-dot active';
  document.getElementById('stepDot2').className = 'step-dot';
});

// Etapa 2: radio auto-avança ao selecionar
document.querySelectorAll('input[name="momento"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const val = radio.value;
    if (val === 'quer-trafego') {
      setTimeout(() => {
        document.getElementById('modalForm').style.display = 'none';
        document.getElementById('modalEducativo').classList.add('show');
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'LeadNaoQualificado', {
            content_name: 'Diagnóstico Gratuito',
            motivo: 'quer-trafego',
          });
        }
      }, 350);
      return;
    }
    setTimeout(() => {
      document.getElementById('formStep2').hidden = true;
      document.getElementById('formStep3').hidden = false;
      document.getElementById('stepDot2').className = 'step-dot done';
      document.getElementById('stepDot3').className = 'step-dot active';
      document.getElementById('f-nome').focus();
    }, 400);
  });
});

// Etapa 3 → 2 (voltar)
document.getElementById('btnStep3Back').addEventListener('click', () => {
  document.getElementById('formStep3').hidden = true;
  document.getElementById('formStep2').hidden = false;
  document.getElementById('stepDot2').className = 'step-dot active';
  document.getElementById('stepDot3').className = 'step-dot';
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

// @ automático no Instagram
const instaInput = document.getElementById('f-insta');
if (instaInput) {
  instaInput.addEventListener('input', function () {
    if (this.value.length > 0 && this.value[0] !== '@') {
      this.value = '@' + this.value.replace(/@/g, '');
    }
    if (this.value === '') this.value = '';
  });
  instaInput.addEventListener('focus', function () {
    if (this.value === '') this.value = '@';
  });
  instaInput.addEventListener('blur', function () {
    if (this.value === '@') this.value = '';
  });
}

// Limpa erro ao digitar/selecionar
['f-nome','f-whats','f-email','f-insta','f-vendedores','f-faturamento'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id, 'err-' + id.replace('f-','')));
});
document.querySelectorAll('input[name="momento"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('err-momento').textContent = '';
  });
});

function validateForm() {
  let ok = true;
  const nome   = document.getElementById('f-nome').value.trim();
  const whats  = document.getElementById('f-whats').value.replace(/\D/g,'');
  const email  = document.getElementById('f-email').value.trim();
  const insta  = document.getElementById('f-insta').value.trim();
  const vendas = document.getElementById('f-vendedores').value;
  const fat    = document.getElementById('f-faturamento').value;

  if (nome.length < 3) {
    showError('f-nome', 'err-nome', 'Informe seu nome completo.'); ok = false;
  }
  if (whats.length < 10) {
    showError('f-whats', 'err-whats', 'Número inválido. Use (XX) XXXXX-XXXX.'); ok = false;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('f-email', 'err-email', 'E-mail inválido.'); ok = false;
  }
  if (insta.replace(/^@/, '').length < 2) {
    showError('f-insta', 'err-insta', 'Informe o Instagram da empresa.'); ok = false;
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
// Google Sheets via Apps Script
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyeqzKibrD4S9fTgBG6KQUc2ek-2UDE3UJsd1N4rYbKZTIYd33QHjQ6mJXKh8ux6b3M9A/exec';
const N8N_ENDPOINT  = 'https://webhook.lionmidiasia.com/webhook/8287de5d-c83a-4f5f-98d7-58590d350325';

// Captura UTMs + fbclid + cookies Meta da URL
function getUTMs() {
  const p = new URLSearchParams(window.location.search);

  // fbclid → formata como fbc exigido pela Meta: fb.1.{timestamp}.{fbclid}
  const fbclid = p.get('fbclid') || '';
  const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : getCookie('_fbc') || '';

  return {
    utm_source:   p.get('utm_source')   || '',
    utm_medium:   p.get('utm_medium')   || '',
    utm_campaign: p.get('utm_campaign') || '',
    utm_adset:    p.get('utm_adset')    || '',
    utm_content:  p.get('utm_content')  || '',
    utm_term:     p.get('utm_term')     || '',
    fbclid,
    fbc,
    fbp: getCookie('_fbp') || '',
  };
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

document.getElementById('modalForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Anti-bot: honeypot preenchido = bot
  if (document.getElementById('f-website').value !== '') return;

  // Anti-bot: formulário enviado em menos de 3 segundos = bot
  if (Date.now() - _modalOpenedAt < 3000) return;

  if (!validateForm()) return;

  const btn = document.getElementById('modalSubmitBtn');
  btn.classList.add('loading');
  btn.disabled = true;

  // Protocolo único de deduplicação — mesmo ID enviado ao Pixel e à CAPI
  const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

  const vendedores  = document.getElementById('f-vendedores').value;
  const faturamento = document.getElementById('f-faturamento').value;
  const momento     = document.querySelector('input[name="momento"]:checked')?.value || '';

  // Qualificação ICP: faturamento OK + tem equipe + momento alinhado
  const icp =
    vendedores  !== 'apenas-eu' &&
    faturamento !== 'menos-50k' &&
    (momento === 'anuncio-sem-venda' || momento === 'time-sem-processo');

  let motivoICP = null;
  if (!icp) {
    const razoes = [];
    if (vendedores === 'apenas-eu')   razoes.push('sem-equipe');
    if (faturamento === 'menos-50k')  razoes.push('faturamento-baixo');
    if (momento === 'sem-marketing')  razoes.push('sem-marketing');
    if (momento !== 'anuncio-sem-venda' && momento !== 'time-sem-processo' && momento !== 'sem-marketing') {
      razoes.push('momento-desalinhado');
    }
    motivoICP = razoes.join('+') || 'desconhecido';
  }

  const payload = {
    nome:        document.getElementById('f-nome').value.trim(),
    whatsapp:    document.getElementById('f-whats').value.trim(),
    email:       document.getElementById('f-email').value.trim(),
    instagram:   document.getElementById('f-insta').value.trim(),
    vendedores,
    faturamento,
    momento,
    qualificado: icp,
    motivo:      motivoICP,
    event_id:    eventId,
    page_url:    window.location.href,
    ...getUTMs(),
  };

  let waMsg, successTitle, successText;

  const emailLine = payload.email     ? `\nE-mail: ${payload.email}`         : '';
  const instaLine = payload.instagram ? `\nInstagram: ${payload.instagram}`   : '';

  if (icp) {
    waMsg = encodeURIComponent(
      `Olá! Quero meu diagnóstico gratuito.\n\nNome: ${payload.nome}\nWhatsApp: ${payload.whatsapp}${emailLine}${instaLine}\nVendedores: ${payload.vendedores}\nFaturamento: ${payload.faturamento}\nMomento: ${payload.momento}`
    );
    successTitle = 'Recebemos seu contato!';
    successText  = 'Em breve nossa equipe vai entrar em contato pelo WhatsApp para agendar seu diagnóstico gratuito.';
  } else {
    waMsg = encodeURIComponent(
      `Olá! Tenho interesse nas soluções da Lion Mídias.\n\nNome: ${payload.nome}\nWhatsApp: ${payload.whatsapp}${emailLine}${instaLine}\nVendedores: ${payload.vendedores}\nFaturamento: ${payload.faturamento}\nMomento: ${payload.momento}`
    );
    successTitle = 'Recebemos seu contato!';
    successText  = 'Nossa equipe vai entrar em contato em breve com a melhor solução para o momento da sua empresa.';
  }

  const waURL = `https://wa.me/556281547209?text=${waMsg}`;

  // Abre WhatsApp AGORA (síncrono com o gesto do usuário) — evita bloqueio de popup
  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Atualiza copy da tela de sucesso conforme qualificação
  document.querySelector('#modalSuccess h3').textContent = successTitle;
  document.querySelector('#modalSuccess p').textContent  = successText;

  // Mostra sucesso imediatamente
  document.getElementById('modalForm').style.display = 'none';
  document.getElementById('modalSuccess').classList.add('show');

  // Pixel: Lead para ICP / LeadNaoQualificado para não-ICP
  if (typeof fbq === 'function') {
    if (icp) {
      fbq('track', 'Lead', {
        content_name: 'Diagnóstico Gratuito',
        content_category: 'Formulário',
      }, { eventID: eventId });
    } else {
      fbq('trackCustom', 'LeadNaoQualificado', {
        content_name:     'Diagnóstico Gratuito',
        content_category: 'Formulário',
        motivo:      motivoICP,
        vendedores:  payload.vendedores,
        faturamento: payload.faturamento,
      });
    }
  }

  btn.classList.remove('loading');
  btn.disabled = false;

  // Envia para Sheets e n8n em background (não bloqueia o usuário)
  try {
    await Promise.all([
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      fetch(N8N_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    ]);
  } catch {
    // ignora erro — dados enviados para WhatsApp de qualquer forma
  }
});

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
