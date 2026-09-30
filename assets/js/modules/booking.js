/**
 * Hotel Seminário Torre d'Aguilha - Booking Engine Module
 * Gere o fluxo de reserva de quartos em 4 passos:
 * 1. Estadia & Tipologia
 * 2. Dados do Hóspede
 * 3. Pagamento & Resumo
 * 4. Confirmação, aviso de e-mail e contagem regressiva de 15s
 */

export function initBookingEngine() {
  const secStep1 = document.getElementById('section-step-1');
  const secStep2 = document.getElementById('section-step-2');
  const secStep3 = document.getElementById('section-step-3');
  const secStep4 = document.getElementById('section-step-4');

  if (!secStep1) return; // Não é a página de reserva

  // Indicadores do Stepper
  const ind1 = document.getElementById('step-indicator-1');
  const ind2 = document.getElementById('step-indicator-2');
  const ind3 = document.getElementById('step-indicator-3');
  const ind4 = document.getElementById('step-indicator-4');

  // Inputs de Datas e Quarto
  const inCheckin = document.getElementById('booking-checkin');
  const inCheckout = document.getElementById('booking-checkout');
  const inAdults = document.getElementById('booking-adults');
  const inChildren = document.getElementById('booking-children');
  const roomRadios = document.querySelectorAll('.room-radio');

  // Elementos de Resumo
  const step1Nights = document.getElementById('step1-nights-count');
  const step1Price = document.getElementById('step1-estimated-price');

  // Datas padrão (amanhã até dia seguinte)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (d) => d.toISOString().split('T')[0];

  if (inCheckin && !inCheckin.value) {
    inCheckin.min = formatDate(today);
    inCheckin.value = formatDate(tomorrow);
  }
  if (inCheckout && !inCheckout.value) {
    inCheckout.min = formatDate(tomorrow);
    inCheckout.value = formatDate(dayAfter);
  }

  // Leitura de parâmetros URL (?room=...&checkin=...&checkout=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRoom = urlParams.get('room') || urlParams.get('room_type');
  const paramCheckin = urlParams.get('checkin');
  const paramCheckout = urlParams.get('checkout');

  if (paramCheckin && inCheckin) inCheckin.value = paramCheckin;
  if (paramCheckout && inCheckout) inCheckout.value = paramCheckout;

  if (paramRoom) {
    roomRadios.forEach(radio => {
      if (radio.value.toLowerCase().includes(paramRoom.toLowerCase()) || paramRoom.toLowerCase().includes(radio.value.toLowerCase())) {
        radio.checked = true;
      }
    });
  }

  // Cálculo de Noites e Preço
  function calculateSummary() {
    const d1 = new Date(inCheckin.value);
    const d2 = new Date(inCheckout.value);
    let nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights < 1) nights = 1;

    let selectedPrice = 75;
    let selectedRoomName = 'Quarto Duplo Ala Moderna';
    roomRadios.forEach(r => {
      const card = r.closest('.room-choice-card');
      const badge = card?.querySelector('.room-selected-badge');
      if (r.checked) {
        selectedPrice = parseFloat(r.getAttribute('data-price')) || 75;
        selectedRoomName = r.value;
        card?.classList.add('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.remove('border-gray-200', 'bg-white');
        badge?.classList.remove('hidden');
      } else {
        card?.classList.remove('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.add('border-gray-200', 'bg-white');
        badge?.classList.add('hidden');
      }
    });

    const baseTotal = selectedPrice * nights;
    const discountVal = baseTotal * 0.08;
    const finalTotal = baseTotal - discountVal;

    if (step1Nights) step1Nights.textContent = nights;
    if (step1Price) step1Price.textContent = finalTotal.toFixed(2) + ' €';

    // Atualizar Passo 3 Resumo
    const sumRoom = document.getElementById('summary-room-name');
    const sumDates = document.getElementById('summary-dates');
    const sumBase = document.getElementById('summary-base-price');
    const sumDisc = document.getElementById('summary-discount');
    const sumTotal = document.getElementById('summary-final-total');
    const sumOcc = document.getElementById('summary-occupancy');

    if (sumRoom) sumRoom.textContent = selectedRoomName;
    if (sumDates) sumDates.textContent = `${inCheckin.value} a ${inCheckout.value} (${nights} noites)`;
    if (sumBase) sumBase.textContent = baseTotal.toFixed(2) + ' €';
    if (sumDisc) sumDisc.textContent = '-' + discountVal.toFixed(2) + ' €';
    if (sumTotal) sumTotal.textContent = finalTotal.toFixed(2) + ' €';
    if (sumOcc) sumOcc.textContent = `${inAdults?.value || 2} Adultos, ${inChildren?.value || 0} Crianças`;

    return { nights, selectedRoomName, finalTotal, baseTotal };
  }

  inCheckin?.addEventListener('change', () => {
    inCheckout.min = inCheckin.value;
    if (new Date(inCheckout.value) <= new Date(inCheckin.value)) {
      const nextDay = new Date(inCheckin.value);
      nextDay.setDate(nextDay.getDate() + 1);
      inCheckout.value = formatDate(nextDay);
    }
    calculateSummary();
  });
  inCheckout?.addEventListener('change', calculateSummary);
  inAdults?.addEventListener('change', calculateSummary);
  inChildren?.addEventListener('change', calculateSummary);
  roomRadios.forEach(r => r.addEventListener('change', calculateSummary));

  calculateSummary();

  // PASSO 1 -> PASSO 2
  const formStep1 = document.getElementById('form-step-1');
  formStep1?.addEventListener('submit', (e) => {
    e.preventDefault();
    secStep2.classList.remove('hidden');
    secStep2.scrollIntoView({ behavior: 'smooth', block: 'start' });

    ind1.querySelector('.step-circle').innerHTML = '✓';
    ind1.querySelector('.step-circle').classList.replace('bg-[#173A46]', 'bg-emerald-600');
    ind2.classList.replace('text-gray-400', 'text-[#173A46]');
    ind2.querySelector('.step-circle').classList.replace('bg-gray-100', 'bg-[#173A46]');
    ind2.querySelector('.step-circle').classList.replace('text-gray-500', 'text-white');
  });

  // Voltar ao Passo 1
  const backStep1 = document.getElementById('btn-back-to-step-1');
  const backStep1Alt = document.getElementById('btn-back-to-step-1-alt');
  [backStep1, backStep1Alt].forEach(btn => {
    btn?.addEventListener('click', () => {
      secStep1.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // PASSO 2 -> PASSO 3
  const formStep2 = document.getElementById('form-step-2');
  formStep2?.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('guest-firstname').value.trim();
    const lastName = document.getElementById('guest-lastname').value.trim();
    const fullName = `${firstName} ${lastName}`;

    const sumGuestName = document.getElementById('summary-guest-name');
    if (sumGuestName) sumGuestName.textContent = fullName;

    secStep3.classList.remove('hidden');
    secStep3.scrollIntoView({ behavior: 'smooth', block: 'start' });

    ind2.querySelector('.step-circle').innerHTML = '✓';
    ind2.querySelector('.step-circle').classList.replace('bg-[#173A46]', 'bg-emerald-600');
    ind3.classList.replace('text-gray-400', 'text-[#173A46]');
    ind3.querySelector('.step-circle').classList.replace('bg-gray-100', 'bg-[#173A46]');
    ind3.querySelector('.step-circle').classList.replace('text-gray-500', 'text-white');
  });

  // Voltar ao Passo 2
  const backStep2 = document.getElementById('btn-back-to-step-2');
  const backStep2Alt = document.getElementById('btn-back-to-step-2-alt');
  [backStep2, backStep2Alt].forEach(btn => {
    btn?.addEventListener('click', () => {
      secStep2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Alternância de Métodos de Pagamento
  const payRadios = document.querySelectorAll('input[name="payment_method"]');
  const cardBox = document.getElementById('card-fields-box');
  const mbwayBox = document.getElementById('mbway-fields-box');
  const hotelpayBox = document.getElementById('hotelpay-fields-box');

  payRadios.forEach(pr => {
    pr.addEventListener('change', () => {
      document.querySelectorAll('.payment-method-option').forEach(opt => {
        opt.classList.remove('border-[#173A46]', 'bg-[#FAF9F6]');
        opt.classList.add('border-gray-200', 'bg-white');
      });
      const parent = pr.closest('.payment-method-option');
      parent.classList.add('border-[#173A46]', 'bg-[#FAF9F6]');
      parent.classList.remove('border-gray-200', 'bg-white');

      cardBox?.classList.toggle('hidden', pr.value !== 'Cartão de Crédito / Débito');
      mbwayBox?.classList.toggle('hidden', pr.value !== 'MB WAY');
      hotelpayBox?.classList.toggle('hidden', pr.value !== 'Pagamento no Check-in com Garantia');
    });
  });

  // PASSO 3 -> PASSO 4: CONFIRMAÇÃO & REDIRECIONAMENTO 15s
  const btnConfirmPayment = document.getElementById('btn-confirm-payment');
  btnConfirmPayment?.addEventListener('click', () => {
    const firstName = document.getElementById('guest-firstname').value.trim();
    const lastName = document.getElementById('guest-lastname').value.trim();
    const fullName = `${firstName} ${lastName}` || 'Estimado(a) Hóspede';
    const email = document.getElementById('guest-email').value.trim() || 'o seu e-mail';

    const { nights, selectedRoomName, finalTotal } = calculateSummary();

    const randomRef = 'STA-' + (Math.floor(1000 + Math.random() * 9000));
    document.getElementById('confirmed-booking-code').textContent = '#' + randomRef;
    document.getElementById('confirmed-guest-name').textContent = fullName;
    document.getElementById('confirmed-room-type').textContent = selectedRoomName;
    document.getElementById('confirmed-dates').textContent = `${inCheckin.value} até ${inCheckout.value} (${nights} noites)`;
    document.getElementById('confirmed-total').textContent = finalTotal.toFixed(2) + ' €';
    document.getElementById('confirmed-email-display').textContent = email;

    secStep1.classList.add('hidden');
    secStep2.classList.add('hidden');
    secStep3.classList.add('hidden');
    secStep4.classList.remove('hidden');
    secStep4.scrollIntoView({ behavior: 'smooth', block: 'start' });

    ind3.querySelector('.step-circle').innerHTML = '✓';
    ind3.querySelector('.step-circle').classList.replace('bg-[#173A46]', 'bg-emerald-600');
    ind4.classList.replace('text-gray-400', 'text-[#173A46]');
    ind4.querySelector('.step-circle').innerHTML = '✓';
    ind4.querySelector('.step-circle').classList.replace('bg-gray-100', 'bg-emerald-600');
    ind4.querySelector('.step-circle').classList.replace('text-gray-500', 'text-white');

    let secondsLeft = 15;
    const countdownEl = document.getElementById('redirect-countdown');

    const countdownInterval = setInterval(() => {
      secondsLeft--;
      if (countdownEl) countdownEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        window.location.href = 'index.html';
      }
    }, 1000);
  });
}
