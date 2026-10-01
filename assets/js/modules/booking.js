/**
 * Hotel Seminário Torre d'Aguilha - Booking Engine Module
 * Gere o fluxo de reserva de quartos em 4 passos:
 * 1. Estadia, Tipologia & Opção de Tarifa (Não Reembolsável / Cancelamento Gratuito)
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

  // Inputs de Datas, Quarto e Tarifa
  const inCheckin = document.getElementById('booking-checkin');
  const inCheckout = document.getElementById('booking-checkout');
  const inAdults = document.getElementById('booking-adults');
  const inChildren = document.getElementById('booking-children');
  const roomRadios = document.querySelectorAll('.room-radio');
  const rateRadios = document.querySelectorAll('.rate-radio');

  // Elementos de Resumo
  const step1Nights = document.getElementById('step1-nights-count');
  const step1Price = document.getElementById('step1-estimated-price');
  const step1PromoBadge = document.getElementById('step1-promo-badge');
  const step1RateDesc = document.getElementById('step1-rate-desc');

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

  // Leitura de parâmetros URL (?room=...&rate=...&checkin=...&checkout=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramRoom = urlParams.get('room') || urlParams.get('room_type');
  const paramRate = urlParams.get('rate');
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

  if (paramRate) {
    rateRadios.forEach(radio => {
      if (radio.value.toLowerCase() === paramRate.toLowerCase() || 
         (paramRate.toLowerCase().includes('flex') && radio.value === 'flexivel') ||
         (paramRate.toLowerCase().includes('reembols') && radio.value === 'nao_reembolsavel')) {
        radio.checked = true;
      }
    });
  }

  // Preçário oficial das tipologias (Flexível e Não Reembolsável -8%)
  const roomPricing = {
    'Quarto Ala Moderna': {
      flex: 73.00,
      nr: 67.16
    },
    'Quarto Ala Clássica': {
      flex: 65.00,
      nr: 59.80
    }
  };

  // Cálculo de Noites, Tarifas e Preços
  function calculateSummary() {
    const d1 = new Date(inCheckin.value);
    const d2 = new Date(inCheckout.value);
    let nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights < 1) nights = 1;

    let selectedRoomKey = 'Quarto Ala Moderna';
    let selectedRoomName = 'Quarto Duplo Ala Moderna';

    roomRadios.forEach(r => {
      const card = r.closest('.room-choice-card');
      const badge = card?.querySelector('.room-selected-badge');
      if (r.checked) {
        selectedRoomKey = r.value;
        selectedRoomName = r.value === 'Quarto Ala Moderna' ? 'Quarto Duplo Ala Moderna' : 'Quarto Ala Clássica';
        card?.classList.add('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.remove('border-gray-200', 'bg-white');
        badge?.classList.remove('hidden');
      } else {
        card?.classList.remove('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.add('border-gray-200', 'bg-white');
        badge?.classList.add('hidden');
      }
    });

    const prices = roomPricing[selectedRoomKey] || roomPricing['Quarto Ala Moderna'];

    // Atualizar os valores exibidos nos cartões de tarifa conforme o quarto
    const rateNrOld = document.getElementById('rate-display-nr-old');
    const rateNrPrice = document.getElementById('rate-display-nr-price');
    const rateFlexPrice = document.getElementById('rate-display-flex-price');

    if (rateNrOld) rateNrOld.textContent = prices.flex.toFixed(2).replace('.', ',') + ' €';
    if (rateNrPrice) rateNrPrice.textContent = prices.nr.toFixed(2).replace('.', ',') + ' €';
    if (rateFlexPrice) rateFlexPrice.textContent = prices.flex.toFixed(2).replace('.', ',') + ' €';

    let selectedRateType = 'nao_reembolsavel';
    rateRadios.forEach(rr => {
      const card = rr.closest('.rate-choice-card');
      const badge = card?.querySelector('.rate-selected-badge');
      if (rr.checked) {
        selectedRateType = rr.value;
        card?.classList.add('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.remove('border-gray-200', 'bg-white');
        badge?.classList.remove('hidden');
      } else {
        card?.classList.remove('border-[#173A46]', 'bg-[#FAF9F6]');
        card?.classList.add('border-gray-200', 'bg-white');
        badge?.classList.add('hidden');
      }
    });

    const isNonRefundable = (selectedRateType === 'nao_reembolsavel');
    const baseNightPrice = prices.flex;
    const baseTotal = baseNightPrice * nights;
    let finalTotal = 0;
    let discountVal = 0;
    let rateLabel = '';

    if (isNonRefundable) {
      finalTotal = prices.nr * nights;
      discountVal = baseTotal - finalTotal;
      rateLabel = 'Preço de Oferta (-8%) • Não Reembolsável';

      if (step1PromoBadge) {
        step1PromoBadge.textContent = 'DIRETO8 (-8%)';
        step1PromoBadge.className = 'px-2 py-1 rounded bg-[#C5A880]/20 text-[#173A46] font-mono font-bold text-xs';
      }
      if (step1RateDesc) {
        step1RateDesc.innerHTML = '<strong>Tarifa Não Reembolsável</strong> selecionada com 8% de desconto direto.';
      }
    } else {
      finalTotal = baseTotal;
      discountVal = 0;
      rateLabel = 'Cancelamento Gratuito (Tarifa Flexível)';

      if (step1PromoBadge) {
        step1PromoBadge.textContent = 'TARIFA FLEXÍVEL';
        step1PromoBadge.className = 'px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-xs';
      }
      if (step1RateDesc) {
        step1RateDesc.innerHTML = '<strong>Cancelamento Gratuito</strong> até 48h antes da data de check-in.';
      }
    }

    if (step1Nights) step1Nights.textContent = nights;
    if (step1Price) step1Price.textContent = finalTotal.toFixed(2) + ' €';

    // Atualizar Resumo no Passo 3
    const sumRoom = document.getElementById('summary-room-name');
    const sumRate = document.getElementById('summary-rate-name');
    const sumDates = document.getElementById('summary-dates');
    const sumBase = document.getElementById('summary-base-price');
    const sumDiscRow = document.getElementById('summary-discount-row');
    const sumDisc = document.getElementById('summary-discount');
    const sumTotal = document.getElementById('summary-final-total');
    const sumOcc = document.getElementById('summary-occupancy');

    if (sumRoom) sumRoom.textContent = selectedRoomName;
    if (sumRate) sumRate.textContent = rateLabel;
    if (sumDates) sumDates.textContent = `${inCheckin.value} a ${inCheckout.value} (${nights} noites)`;
    if (sumBase) sumBase.textContent = baseTotal.toFixed(2) + ' €';
    if (sumDisc) sumDisc.textContent = '-' + discountVal.toFixed(2) + ' €';
    if (sumDiscRow) sumDiscRow.classList.toggle('hidden', !isNonRefundable);
    if (sumTotal) sumTotal.textContent = finalTotal.toFixed(2) + ' €';
    if (sumOcc) sumOcc.textContent = `${inAdults?.value || 2} Adultos, ${inChildren?.value || 0} Crianças`;

    // Atualizar Caixa de Política de Cancelamento
    const policyBox = document.getElementById('booking-policy-box');
    const policyText = document.getElementById('booking-policy-text');
    const policyIcon = document.getElementById('booking-policy-icon');

    if (policyBox && policyText) {
      if (isNonRefundable) {
        policyBox.className = 'p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5';
        policyText.innerHTML = '<strong>Tarifa Não Reembolsável:</strong> O valor total é cobrado ao confirmar a reserva para garantir a tarifa promocional com 8% de desconto direto. Não são permitidos cancelamentos ou reembolsos.';
        if (policyIcon) {
          policyIcon.setAttribute('class', 'w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5');
          policyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>';
        }
      } else {
        policyBox.className = 'p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5';
        policyText.innerHTML = '<strong>Cancelamento Gratuito:</strong> Pode cancelar ou alterar a sua reserva sem qualquer custo até 48 horas antes da data de check-in.';
        if (policyIcon) {
          policyIcon.setAttribute('class', 'w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5');
          policyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
        }
      }
    }

    return { nights, selectedRoomName, rateLabel, finalTotal, baseTotal, isNonRefundable };
  }

  // Event Listeners para recálculo dinâmico
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
  rateRadios.forEach(r => r.addEventListener('change', calculateSummary));

  // Execução inicial
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
    const fullName = `${firstName} ${lastName}`.trim() || 'Estimado(a) Hóspede';

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

  // Seleção do Método de Pagamento
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

  // PASSO 3 -> PASSO 4 (Confirmação, E-mail & Contagem Regressiva)
  const btnConfirmPayment = document.getElementById('btn-confirm-payment');
  btnConfirmPayment?.addEventListener('click', () => {
    const firstName = document.getElementById('guest-firstname').value.trim();
    const lastName = document.getElementById('guest-lastname').value.trim();
    const fullName = `${firstName} ${lastName}`.trim() || 'Estimado(a) Hóspede';
    const email = document.getElementById('guest-email').value.trim() || 'o seu e-mail';

    const { nights, selectedRoomName, rateLabel, finalTotal } = calculateSummary();

    const randomRef = 'STA-' + (Math.floor(1000 + Math.random() * 9000));
    document.getElementById('confirmed-booking-code').textContent = '#' + randomRef;
    document.getElementById('confirmed-guest-name').textContent = fullName;
    document.getElementById('confirmed-room-type').textContent = selectedRoomName;
    const confRate = document.getElementById('confirmed-rate-type');
    if (confRate) confRate.textContent = rateLabel;
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
