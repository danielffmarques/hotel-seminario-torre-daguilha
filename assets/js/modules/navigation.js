/**
 * Hotel Seminário Torre d'Aguilha - Navigation Module
 * Controla menu mobile, cabeçalho sticky, redirecionamentos e datas padrão.
 */

export function initNavigation() {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Sticky Navbar Shadow on Scroll
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

  // 4. Fallback de Redirecionamento para botões de reserva
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

  // 5. Barra de Pesquisa de Reserva -> reserva.html com parâmetros
  const reservationForms = document.querySelectorAll('.reservation-form');
  reservationForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkin = form.querySelector('[name="checkin"]')?.value || '';
      const checkout = form.querySelector('[name="checkout"]')?.value || '';
      const guests = form.querySelector('[name="guests"]')?.value || '';
      const roomType = form.querySelector('[name="room_type"]')?.value || '';
      const promo = form.querySelector('[name="promo"]')?.value || '';

      const params = new URLSearchParams();
      if (checkin) params.set('checkin', checkin);
      if (checkout) params.set('checkout', checkout);
      if (guests) params.set('adults', guests);
      if (roomType) params.set('room', roomType);
      if (promo) params.set('promo', promo);

      window.location.href = `reserva.html?${params.toString()}`;
    });
  });

  // 6. Header "Reservar Quarto" button fade after leaving Hero section
  const heroSection = document.getElementById('hero-section');
  const navReservationBtn = document.getElementById('nav-reservation-btn');

  if (heroSection && navReservationBtn) {
    function handleHeroScroll() {
      const heroRect = heroSection.getBoundingClientRect();
      const headerThreshold = 80;
      
      if (heroRect.bottom <= headerThreshold) {
        navReservationBtn.classList.remove('is-hidden', 'opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
        navReservationBtn.classList.add('is-visible', 'opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
      } else {
        navReservationBtn.classList.add('is-hidden', 'opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
        navReservationBtn.classList.remove('is-visible', 'opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
      }
    }

    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    window.addEventListener('resize', handleHeroScroll);
    handleHeroScroll();
  }
}
