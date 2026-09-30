// Hotel Seminário Torre d'Aguilha - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Sticky Navbar shadow on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('shadow-md', 'bg-white/95');
      header?.classList.remove('bg-white');
    } else {
      header?.classList.remove('shadow-md', 'bg-white/95');
      header?.classList.add('bg-white');
    }
  });

  // 3. Pre-fill Check-in and Check-out dates if empty
  const today = new Date();
  const tomorrow = new Date(Date.now() + 86400000);
  const formatDate = (d) => d.toISOString().split('T')[0];

  document.querySelectorAll('input[type="date"][name="checkin"]').forEach(input => {
    if (!input.value) input.value = formatDate(today);
    input.min = formatDate(today);
  });
  document.querySelectorAll('input[type="date"][name="checkout"]').forEach(input => {
    if (!input.value) input.value = formatDate(tomorrow);
    input.min = formatDate(tomorrow);
  });

  // 4. Redirecionamento de CTAs de Reserva para a nova página reserva.html
  const openReservationBtns = document.querySelectorAll('.open-reservation-modal');
  openReservationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedRoom = btn.getAttribute('data-room');
      if (preselectedRoom) {
        window.location.href = `reserva.html?room=${encodeURIComponent(preselectedRoom)}`;
      } else {
        window.location.href = 'reserva.html';
      }
    });
  });

  // 5. Redirecionamento da barra de pesquisa do Hero para reserva.html com parâmetros
  const reservationForms = document.querySelectorAll('.reservation-form');
  reservationForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkin = form.querySelector('[name="checkin"]')?.value || '';
      const checkout = form.querySelector('[name="checkout"]')?.value || '';
      const roomType = form.querySelector('[name="room_type"]')?.value || '';
      const promo = form.querySelector('[name="promo"]')?.value || 'DIRETO8';

      const params = new URLSearchParams();
      if (checkin) params.set('checkin', checkin);
      if (checkout) params.set('checkout', checkout);
      if (roomType) params.set('room', roomType);
      if (promo) params.set('promo', promo);

      window.location.href = `reserva.html?${params.toString()}`;
    });
  });

  // 6. Direct Contact Question Form Handler
  const questionForms = document.querySelectorAll('.question-form');
  questionForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]')?.value || 'Estimado(a)';
      alert(`Obrigado pelo seu contacto, ${name}!\nA nossa equipa responderá à sua questão com brevidade para o email indicado.`);
      form.reset();
    });
  });

  // 7. Carousel Logic (if present on page)
  const carousel = document.querySelector('.hotel-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let timer = null;

    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        if (i === currentIndex) {
          slide.classList.remove('opacity-0', 'pointer-events-none');
          slide.classList.add('opacity-100');
        } else {
          slide.classList.add('opacity-0', 'pointer-events-none');
          slide.classList.remove('opacity-100');
        }
      });

      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('bg-[#173A46]', 'w-8');
          dot.classList.remove('bg-gray-300', 'w-3');
        } else {
          dot.classList.remove('bg-[#173A46]', 'w-8');
          dot.classList.add('bg-gray-300', 'w-3');
        }
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 5000);
    }

    function stopAutoPlay() {
      if (timer) clearInterval(timer);
    }

    prevBtn?.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAutoPlay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoPlay();
      });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  }

  // 8. FAQ Accordion Logic (+ / − toggle)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    const symbol = item.querySelector('.faq-symbol');

    btn?.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
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

  // 8.1 FAQ Sticky Form Dynamic Boundary (Synchronize right column height with questions list)
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

    // Recalculate whenever an accordion item is clicked or toggled
    const faqButtons = faqsQuestionsList.querySelectorAll('.faq-button');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(syncFaqHeight, 50);
        setTimeout(syncFaqHeight, 350);
      });
    });
  }

  // 9. Salas Filter Logic (on salas-eventos.html)
  const filterForm = document.getElementById('salas-filter-form');
  if (filterForm) {
    const salaCards = document.querySelectorAll('.sala-card');
    const noResultsMsg = document.getElementById('no-salas-found');
    const resetBtn = document.getElementById('reset-filters-btn');

    function applyFilters() {
      const format = filterForm.querySelector('#filter-format')?.value || 'all';
      const minPax = parseInt(filterForm.querySelector('#filter-pax')?.value || '0', 10);
      const maxPrice = parseInt(filterForm.querySelector('#filter-price')?.value || '1000', 10);

      // Update price display label
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

  // 10. Room Interactive Gallery (Thumbnail Click swaps into Main Image)
  const roomThumbBtns = document.querySelectorAll('.room-thumb-btn');
  roomThumbBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const fullSrc = btn.getAttribute('data-full');
      const altText = btn.getAttribute('data-alt') || '';
      const mainImg = document.getElementById(targetId);

      if (mainImg && fullSrc) {
        // Smooth transition effect
        mainImg.classList.add('opacity-40');
        setTimeout(() => {
          mainImg.src = fullSrc;
          if (altText) mainImg.alt = altText;
          mainImg.classList.remove('opacity-40');
        }, 150);

        // Update active thumbnail border within the same gallery container
        const parentGallery = btn.parentElement;
        if (parentGallery) {
          parentGallery.querySelectorAll('.room-thumb-btn').forEach(b => {
            b.classList.remove('border-[#173A46]', 'ring-2', 'ring-[#173A46]/30');
            b.classList.add('border-transparent');
          });
          btn.classList.remove('border-transparent');
          btn.classList.add('border-[#173A46]', 'ring-2', 'ring-[#173A46]/30');
        }
      }
    });
  });

  // 11. Header "Reservar Quarto" button smooth fade after leaving Hero section
  const heroSection = document.getElementById('hero-section');
  const navReservationBtn = document.getElementById('nav-reservation-btn');

  if (heroSection && navReservationBtn) {
    function handleHeroScroll() {
      const heroRect = heroSection.getBoundingClientRect();
      const headerThreshold = 80; // altura do cabeçalho sticky
      
      // Quando a parte inferior do hero passa por trás do cabeçalho (utilizador saiu do hero)
      if (heroRect.bottom <= headerThreshold) {
        navReservationBtn.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
        navReservationBtn.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
      } else {
        navReservationBtn.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
        navReservationBtn.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
      }
    }

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    window.addEventListener('resize', handleHeroScroll);
    handleHeroScroll();
  }

  // 12. "O Seminário & Serviços" - 4 Pillars Carousel Logic (Infinite Loop Navigation)
  const servicosTrack = document.getElementById('servicos-carousel-track');
  if (servicosTrack) {
    const prevBtn = document.getElementById('servicos-prev-btn');
    const nextBtn = document.getElementById('servicos-next-btn');
    const carouselContainer = document.getElementById('servicos-carousel');
    const originalSlides = Array.from(servicosTrack.children);
    const originalCount = originalSlides.length;

    if (originalCount > 0) {
      const CLONE_COUNT = 2; // Clone 2 slides at each end for seamless infinite loop (desktop 2-per-view & mobile 1-per-view)

      // Append clones of the first slides
      for (let i = 0; i < CLONE_COUNT; i++) {
        const clone = originalSlides[i].cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.setAttribute('aria-hidden', 'true');
        servicosTrack.appendChild(clone);
      }

      // Prepend clones of the last slides in correct order
      for (let i = originalCount - 1; i >= originalCount - CLONE_COUNT; i--) {
        const clone = originalSlides[i].cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.setAttribute('aria-hidden', 'true');
        servicosTrack.insertBefore(clone, servicosTrack.firstChild);
      }

      let currentIndex = CLONE_COUNT;
      let isTransitioning = false;
      let autoPlayTimer = null;

      function getSlideWidth() {
        const first = servicosTrack.children[0];
        return first ? first.getBoundingClientRect().width : 0;
      }

      function moveToSlide(index, animate = true) {
        if (animate) {
          servicosTrack.style.transition = 'transform 500ms ease-out';
          isTransitioning = true;
        } else {
          servicosTrack.style.transition = 'none';
        }
        currentIndex = index;
        const slideWidth = getSlideWidth();
        servicosTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      }

      function nextSlide() {
        if (isTransitioning) return;
        moveToSlide(currentIndex + 1, true);
      }

      function prevSlide() {
        if (isTransitioning) return;
        moveToSlide(currentIndex - 1, true);
      }

      servicosTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        // When moving forward into clone area at end
        if (currentIndex >= originalCount + CLONE_COUNT) {
          moveToSlide(currentIndex - originalCount, false);
          void servicosTrack.offsetWidth;
        } else if (currentIndex < CLONE_COUNT) {
          // When moving backward into clone area at start
          moveToSlide(currentIndex + originalCount, false);
          void servicosTrack.offsetWidth;
        }
      });

      // Safety check in case tab is backgrounded
      setInterval(() => {
        if (isTransitioning) {
          if (currentIndex >= originalCount + CLONE_COUNT) {
            moveToSlide(currentIndex - originalCount, false);
            isTransitioning = false;
          } else if (currentIndex < CLONE_COUNT) {
            moveToSlide(currentIndex + originalCount, false);
            isTransitioning = false;
          }
        }
      }, 700);

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
          nextSlide();
        }, 5500);
      }

      function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      }

      // Arrow controls
      prevBtn?.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });

      nextBtn?.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });

      // Pause on hover
      if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Touch swipe support for mobile/tablet
        let touchStartX = 0;
        let touchEndX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const swipeDistance = touchEndX - touchStartX;
          if (swipeDistance < -40) {
            nextSlide();
            startAutoPlay();
          } else if (swipeDistance > 40) {
            prevSlide();
            startAutoPlay();
          }
        }, { passive: true });
      }

      // Responsive window resize
      window.addEventListener('resize', () => {
        moveToSlide(currentIndex, false);
      });
      window.addEventListener('load', () => {
        moveToSlide(currentIndex, false);
      });

      // Initial position
      moveToSlide(CLONE_COUNT, false);
      startAutoPlay();
    }
  }

  // 13. "Salas de Eventos" - Pre-select Room Tipology on Form & Smooth Scroll
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

          // Gentle visual highlight on the select field so the user confirms the selection
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

  // 14. Language Selector Interaction (PT, EN, ES, FR)
  const langDropdowns = document.querySelectorAll('.lang-selector-dropdown');
  const savedLang = localStorage.getItem('sta_selected_lang') || 'PT';

  function setActiveLanguage(lang) {
    localStorage.setItem('sta_selected_lang', lang);

    // Update all desktop dropdown indicators and options
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

    // Update mobile language buttons
    document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.className = 'mobile-lang-btn px-2.5 py-1 rounded text-xs font-bold bg-[#173A46] text-white shadow-xs';
      } else {
        btn.className = 'mobile-lang-btn px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200';
      }
    });
  }

  // Set initial active language
  setActiveLanguage(savedLang);

  // Toggle Dropdowns and handle selections
  langDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.lang-selector-btn');
    const menu = dropdown.querySelector('.lang-dropdown-menu');
    const arrow = dropdown.querySelector('.lang-arrow');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains('hidden');
        // Close all other dropdowns
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

  // Mobile language button event listeners
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = btn.getAttribute('data-lang');
      if (selected) setActiveLanguage(selected);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.lang-dropdown-menu').forEach(m => m.classList.add('hidden'));
    document.querySelectorAll('.lang-arrow').forEach(a => a.classList.remove('rotate-180'));
  });
});
