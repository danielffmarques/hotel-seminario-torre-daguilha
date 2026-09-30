/**
 * Hotel Seminário Torre d'Aguilha - Language Selector Module
 * Gere a seleção de idioma (PT, EN, ES, FR) e sincronização desktop/mobile.
 */

export function initLanguageSelector() {
  const langDropdowns = document.querySelectorAll('.lang-selector-dropdown');
  const savedLang = localStorage.getItem('sta_selected_lang') || 'PT';

  function setActiveLanguage(lang) {
    localStorage.setItem('sta_selected_lang', lang);

    // Atualiza indicadores e opções nos dropdowns desktop
    langDropdowns.forEach(dropdown => {
      const currentLabel = dropdown.querySelector('.current-lang-label');
      if (currentLabel) currentLabel.textContent = lang;

      dropdown.querySelectorAll('.lang-option').forEach(opt => {
        const optLang = opt.getAttribute('data-lang');
        const badge = opt.querySelector('.lang-badge');
        if (optLang === lang) {
          opt.classList.add('bg-gray-50', 'text-[#173A46]', 'font-semibold');
          opt.classList.remove('text-gray-700', 'font-medium');
          if (badge) {
            badge.className = 'lang-badge text-[10px] font-bold text-[#A88B63] px-1.5 py-0.5 rounded bg-[#C5A880]/15';
          }
        } else {
          opt.classList.remove('bg-gray-50', 'text-[#173A46]', 'font-semibold');
          opt.classList.add('text-gray-700', 'font-medium');
          if (badge) {
            badge.className = 'lang-badge text-[10px] font-bold text-gray-400 px-1.5 py-0.5 rounded bg-gray-100';
          }
        }
      });
    });

    // Atualiza botões no menu mobile
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.className = 'mobile-lang-btn px-2.5 py-1 rounded text-xs font-bold bg-[#173A46] text-white shadow-xs';
      } else {
        btn.className = 'mobile-lang-btn px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200';
      }
    });
  }

  // Define idioma inicial ativo
  setActiveLanguage(savedLang);

  // Toggle dos Dropdowns Desktop
  langDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.lang-selector-btn');
    const menu = dropdown.querySelector('.lang-dropdown-menu');
    const arrow = dropdown.querySelector('.lang-arrow');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains('hidden');
        document.querySelectorAll('.lang-dropdown-menu').forEach(m => m.classList.add('hidden'));
        document.querySelectorAll('.lang-arrow').forEach(a => a.classList.remove('rotate-180'));

        if (isHidden) {
          menu.classList.remove('hidden');
          arrow?.classList.add('rotate-180');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          menu.classList.add('hidden');
          arrow?.classList.remove('rotate-180');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      menu.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.preventDefault();
          const selected = opt.getAttribute('data-lang');
          if (selected) {
            setActiveLanguage(selected);
            menu.classList.add('hidden');
            arrow?.classList.remove('rotate-180');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  });

  // Event Listeners nos Botões Mobile
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = btn.getAttribute('data-lang');
      if (selected) setActiveLanguage(selected);
    });
  });

  // Fechar dropdowns ao clicar fora
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-dropdown-menu').forEach(m => m.classList.add('hidden'));
    document.querySelectorAll('.lang-arrow').forEach(a => a.classList.remove('rotate-180'));
  });
}
