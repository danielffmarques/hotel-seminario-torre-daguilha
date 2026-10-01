/**
 * Hotel Seminário Torre d'Aguilha - Interactions & Dynamic Motion Module
 * Animações suaves, scroll reveal, contadores numéricos e botão voltar ao topo.
 */

export function initInteractions() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. SCROLL REVEAL COM INTERSECTION OBSERVER
  initScrollReveal(prefersReducedMotion);

  // 2. CONTADORES NUMÉRICOS ANIMADOS
  initStatCounters(prefersReducedMotion);

  // 3. BOTÃO VOLTAR AO TOPO (BACK TO TOP)
  initBackToTop();

  // 4. PARALLAX SUAVE NO HERO
  if (!prefersReducedMotion) {
    initHeroParallax();
  }

  // 5. TOAST FEEDBACK DE CONTACTO RÁPIDO
  initQuickFeedback();
}

/**
 * 1. Scroll Reveal: Animação suave ao entrar no ecrã
 */
function initScrollReveal(prefersReducedMotion) {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 2. Contadores Numéricos: Animação de números que contam suavemente
 */
function initStatCounters(prefersReducedMotion) {
  const counters = document.querySelectorAll('[data-counter-target]');
  if (!counters.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach(counter => {
      counter.textContent = counter.getAttribute('data-counter-target');
    });
    return;
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const targetStr = el.getAttribute('data-counter-target') || el.textContent;
  const target = parseFloat(targetStr);
  const isDecimal = targetStr.includes('.');
  const decimals = isDecimal ? targetStr.split('.')[1].length : 0;
  const duration = 1400; // ms
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing: easeOutCubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = easeProgress * target;

    el.textContent = isDecimal ? currentVal.toFixed(decimals) : Math.floor(currentVal);

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      el.textContent = targetStr;
    }
  }

  requestAnimationFrame(updateCount);
}

/**
 * 3. Botão Flutuante Voltar ao Topo
 */
function initBackToTop() {
  let backToTopBtn = document.getElementById('back-to-top');

  // Criar elemento dinamicamente se ainda não existir no DOM
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo da página');
    backToTopBtn.setAttribute('title', 'Voltar ao topo');
    backToTopBtn.innerHTML = `
      <svg class="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);
  }

  // Controlo de visibilidade no scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 380) {
          backToTopBtn.classList.add('is-active');
        } else {
          backToTopBtn.classList.remove('is-active');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Ação de scroll suave
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 4. Parallax Suave e Leve na Imagem do Hero
 */
function initHeroParallax() {
  const heroSection = document.getElementById('hero-section');
  if (!heroSection) return;

  const heroImg = heroSection.querySelector('img');
  if (!heroImg) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollY < heroHeight) {
          // Deslocamento sutil de 12% para profundidade suave sem saltos
          const offset = scrollY * 0.14;
          heroImg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.02)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 5. Toast Feedback para Ações Interativas (Ex: Copiar contactos)
 */
function initQuickFeedback() {
  let toastEl = document.getElementById('sta-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'sta-toast';
    toastEl.className = 'sta-toast';
    document.body.appendChild(toastEl);
  }

  window.showStaToast = function(message, duration = 3000) {
    toastEl.innerHTML = `
      <svg class="w-4 h-4 text-[#C5A880]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      <span>${message}</span>
    `;
    toastEl.classList.add('is-active');

    setTimeout(() => {
      toastEl.classList.remove('is-active');
    }, duration);
  };
}
