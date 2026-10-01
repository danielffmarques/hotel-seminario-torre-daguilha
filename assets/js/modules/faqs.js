/**
 * Hotel Seminário Torre d'Aguilha - FAQs Module
 * Gere os acordeões interativos e alinhamento de altura da coluna sticky.
 */

export function initRegiaoCards() {
  const regiaoCards = document.querySelectorAll('.regiao-card');
  if (regiaoCards.length === 0) return;

  regiaoCards.forEach(card => {
    const headerBtn = card.querySelector('.regiao-card-header');
    const details = card.querySelector('.regiao-details');
    const arrow = card.querySelector('.regiao-arrow');

    headerBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = !details.classList.contains('hidden');

      // Fecha outros cartões para manter foco visual limpo
      regiaoCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.querySelector('.regiao-details')?.classList.add('hidden');
          otherCard.querySelector('.regiao-arrow')?.classList.remove('rotate-180');
          otherCard.classList.remove('ring-2', 'ring-[#173A46]/20', 'shadow-md');
        }
      });

      if (isOpen) {
        details.classList.add('hidden');
        arrow?.classList.remove('rotate-180');
        card.classList.remove('ring-2', 'ring-[#173A46]/20', 'shadow-md');
      } else {
        details.classList.remove('hidden');
        arrow?.classList.add('rotate-180');
        card.classList.add('ring-2', 'ring-[#173A46]/20', 'shadow-md');
      }
    });
  });
}

export function initFaqs() {
  initRegiaoCards();
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    const symbol = item.querySelector('.faq-symbol');

    btn?.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Fecha todos os outros acordeões
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          const otherSymbol = otherItem.querySelector('.faq-symbol');
          otherContent?.classList.add('hidden');
          otherIcon?.classList.remove('rotate-180');
          if (otherSymbol) otherSymbol.textContent = '+';
        }
      });

      if (isOpen) {
        content.classList.add('hidden');
        icon?.classList.remove('rotate-180');
        if (symbol) symbol.textContent = '+';
      } else {
        content.classList.remove('hidden');
        icon?.classList.add('rotate-180');
        if (symbol) symbol.textContent = '−';
      }
    });
  });

  // Sincronização de altura da coluna sticky de apoio
  const faqsQuestionsList = document.getElementById('faqs-questions-list');
  const faqStickyContainer = document.getElementById('faq-sticky-container');

  if (faqsQuestionsList && faqStickyContainer) {
    function syncFaqHeight() {
      if (window.innerWidth >= 1024) {
        const listHeight = faqsQuestionsList.offsetHeight;
        faqStickyContainer.style.minHeight = listHeight + 'px';
      } else {
        faqStickyContainer.style.minHeight = '';
      }
    }

    window.addEventListener('resize', syncFaqHeight);
    window.addEventListener('load', syncFaqHeight);
    syncFaqHeight();

    const faqButtons = faqsQuestionsList.querySelectorAll('.faq-button');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(syncFaqHeight, 50);
        setTimeout(syncFaqHeight, 350);
      });
    });
  }
}
