/**
 * Hotel Seminário Torre d'Aguilha - Salas Filter & Budget Module
 * Filtro em tempo real de salas de eventos e pré-seleção no formulário de orçamento.
 */

export function initSalasFilter() {
  // 1. Filtro Interativo de Salas
  const filterForm = document.getElementById('salas-filter-form');
  if (filterForm) {
    const salaCards = document.querySelectorAll('.sala-card');
    const noResultsMsg = document.getElementById('no-salas-found');
    const resetBtn = document.getElementById('reset-filters-btn');

    function applyFilters() {
      const format = filterForm.querySelector('#filter-format')?.value || 'all';
      const minPax = parseInt(filterForm.querySelector('#filter-pax')?.value || '0', 10);
      const maxPrice = parseInt(filterForm.querySelector('#filter-price')?.value || '1000', 10);

      const priceDisplay = document.getElementById('price-display-val');
      if (priceDisplay) {
        priceDisplay.textContent = `${maxPrice} €/dia`;
      }

      let visibleCount = 0;

      salaCards.forEach(card => {
        const formatsAvailable = (card.dataset.formats || '').split(',');
        const maxCapacity = parseInt(card.dataset.maxPax || '0', 10);
        const minPrice = parseInt(card.dataset.minPrice || '0', 10);

        let matchesFormat = (format === 'all') || formatsAvailable.includes(format);
        let matchesPax = maxCapacity >= minPax;
        let matchesPrice = minPrice <= maxPrice;

        if (matchesFormat && matchesPax && matchesPrice) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (noResultsMsg) {
        if (visibleCount === 0) {
          noResultsMsg.classList.remove('hidden');
        } else {
          noResultsMsg.classList.add('hidden');
        }
      }

      const countEl = document.getElementById('salas-count');
      if (countEl) {
        countEl.textContent = `${visibleCount} sala(s) encontrada(s)`;
      }
    }

    filterForm.addEventListener('input', applyFilters);
    filterForm.addEventListener('change', applyFilters);

    resetBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      filterForm.reset();
      applyFilters();
    });

    applyFilters();
  }

  // 2. Pré-seleção da Sala no Pedido de Orçamento
  const reservarSalaBtns = document.querySelectorAll('.btn-reservar-sala');
  const salaSelect = document.getElementById('select-sala-preferencia');
  const orcamentoSection = document.getElementById('pedido-orcamento');

  if (reservarSalaBtns.length > 0 && salaSelect) {
    reservarSalaBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const salaCode = btn.getAttribute('data-sala');
        
        if (salaCode) {
          salaSelect.value = salaCode;
          salaSelect.dispatchEvent(new Event('change'));

          salaSelect.classList.add('ring-2', 'ring-[#C5A880]', 'border-[#C5A880]');
          setTimeout(() => {
            salaSelect.classList.remove('ring-2', 'ring-[#C5A880]', 'border-[#C5A880]');
          }, 1800);
        }

        if (orcamentoSection) {
          orcamentoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}
