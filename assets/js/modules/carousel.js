/**
 * Hotel Seminário Torre d'Aguilha - Carousel Module
 * Gere o carrossel infinito com touch/swipe dos 4 pilares e sliders de fotos.
 */

export function initCarousels() {
  // 1. Carrossel Infinito dos 4 Pilares ("O Seminário & Serviços")
  const servicosTrack = document.getElementById('servicos-carousel-track');
  if (servicosTrack) {
    const prevBtn = document.getElementById('servicos-prev-btn');
    const nextBtn = document.getElementById('servicos-next-btn');
    const carouselContainer = document.getElementById('servicos-carousel');
    const originalSlides = Array.from(servicosTrack.children);
    const originalCount = originalSlides.length;

    if (originalCount > 0) {
      const CLONE_COUNT = 2;

      // Adiciona clones no final
      for (let i = 0; i < CLONE_COUNT; i++) {
        const clone = originalSlides[i].cloneNode(true);
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        clone.setAttribute('aria-hidden', 'true');
        servicosTrack.appendChild(clone);
      }

      // Adiciona clones no início
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
        if (currentIndex >= originalCount + CLONE_COUNT) {
          moveToSlide(currentIndex - originalCount, false);
          void servicosTrack.offsetWidth;
        } else if (currentIndex < CLONE_COUNT) {
          moveToSlide(currentIndex + originalCount, false);
          void servicosTrack.offsetWidth;
        }
      });

      function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextSlide, 5500);
      }

      function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      }

      prevBtn?.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });

      nextBtn?.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });

      if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Suporte a Touch Swipe
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

      window.addEventListener('resize', () => moveToSlide(currentIndex, false));
      window.addEventListener('load', () => moveToSlide(currentIndex, false));

      moveToSlide(CLONE_COUNT, false);
      startAutoPlay();
    }
  }

  // 2. Carrossel de Fotografias Geral (.hotel-carousel)
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

    function startSliderAutoPlay() {
      stopSliderAutoPlay();
      timer = setInterval(() => showSlide(currentIndex + 1), 5000);
    }

    function stopSliderAutoPlay() {
      if (timer) clearInterval(timer);
    }

    prevBtn?.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startSliderAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startSliderAutoPlay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startSliderAutoPlay();
      });
    });

    carousel.addEventListener('mouseenter', stopSliderAutoPlay);
    carousel.addEventListener('mouseleave', startSliderAutoPlay);

    showSlide(0);
    startSliderAutoPlay();
  }
}
