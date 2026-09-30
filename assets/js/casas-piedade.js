let idiomaAtual = 'pt';

    // 1. CARROSSEL NARRATIVO (02 — A História [Inicial] | 01 — O Lugar)
    let slideAtual = 0;
    const totalSlides = 2;

    function irParaSlide(index) {
      slideAtual = index;
      document.querySelectorAll('.narrativa-slide').forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
      });

      // Sincronizar abas mobile da narrativa
      document.querySelectorAll('.narrativa-m-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx === index);
      });

      // No Slide 0 (História), o botão fica do lado direito para avançar para "O Lugar"
      // No Slide 1 (Lugar), o botão fica do lado contrário (esquerda) para voltar para trás para "A História"
      const railRight = document.getElementById('rail-right');
      const railLeft = document.getElementById('rail-left');
      if (railRight) railRight.classList.toggle('active', index === 0);
      if (railLeft) railLeft.classList.toggle('active', index === 1);
      setTimeout(sincronizarAlturaBotaoLateral, 40);
    }

    function sincronizarAlturaBotaoLateral() {
      if (window.innerWidth <= 960) return;
      const imgAtiva = document.querySelector('.narrativa-slide.active .slide-img-main') || document.querySelector('.slide-img-main');
      if (!imgAtiva) return;
      const h = imgAtiva.offsetHeight;
      if (h > 0) {
        document.querySelectorAll('.narrativa-lateral-btn').forEach(btn => {
          btn.style.height = h + 'px';
        });
      }
    }

    window.addEventListener('load', sincronizarAlturaBotaoLateral);
    window.addEventListener('resize', sincronizarAlturaBotaoLateral);
    document.addEventListener('DOMContentLoaded', sincronizarAlturaBotaoLateral);
    setTimeout(sincronizarAlturaBotaoLateral, 150);

    function alternarSlideNarrativa() {
      slideAtual = (slideAtual + 1) % totalSlides;
      irParaSlide(slideAtual);
    }

    function proximoSlide() {
      irParaSlide(1);
    }

    function anteriorSlide() {
      irParaSlide(0);
    }

    // 2. ESTRUTURA HORIZONTAL DAS CASAS (EXPANSÃO HORIZONTAL EM HOVER)
    function ativarPainelCasa(index) {
      const panels = document.querySelectorAll('.casa-acc-panel');
      panels.forEach((p, idx) => {
        p.classList.toggle('is-active', idx === index);
      });

      // Sincronizar abas mobile das casas
      document.querySelectorAll('.cm-tab').forEach((tab, idx) => {
        tab.classList.toggle('is-active', idx === index);
      });
    }

    function desativarPaineisCasas() {
      const panels = document.querySelectorAll('.casa-acc-panel');
      panels.forEach(p => p.classList.remove('is-active'));
    }

    function alternarExpansaoCasa(index) {
      ativarPainelCasa(index);
    }

    // Inicialização do Hover nos painéis do acordeão com amortecimento suave
    document.addEventListener('DOMContentLoaded', () => {
      const accPanels = document.querySelectorAll('.casa-acc-panel');
      const accContainer = document.querySelector('.casas-horizontal-accordion');
      let leaveTimeout = null;

      // No mobile / tablet, inicializa a primeira casa aberta para visualização imediata
      if (window.innerWidth <= 960) {
        ativarPainelCasa(0);
      }

      accPanels.forEach((panel, idx) => {
        panel.addEventListener('mouseenter', () => {
          if (window.innerWidth > 960) {
            if (leaveTimeout) {
              clearTimeout(leaveTimeout);
              leaveTimeout = null;
            }
            ativarPainelCasa(idx);
          }
        });
      });

      if (accContainer) {
        accContainer.addEventListener('mouseleave', () => {
          if (leaveTimeout) clearTimeout(leaveTimeout);
          // Amortecimento de 120ms para transição entre cartões sem solavancos (apenas em desktop)
          if (window.innerWidth > 960) {
            leaveTimeout = setTimeout(() => {
              desativarPaineisCasas();
            }, 120);
          }
        });

        accContainer.addEventListener('mouseenter', () => {
          if (leaveTimeout) {
            clearTimeout(leaveTimeout);
            leaveTimeout = null;
          }
        });
      }
    });

    function reservarTipologia(tipoValor) {
      const select = document.getElementById('tipologia');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.includes(tipoValor)) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      const seccaoReserva = document.getElementById('reservar');
      if (seccaoReserva) {
        seccaoReserva.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // 3. MAPA INTERATIVO
    const atividadesData = [
      {
        tagPt: "Acomodação & Ponto de Partida",
        tagEn: "Accommodation & Starting Point",
        tituloPt: "Casas da Piedade",
        tituloEn: "Casas da Piedade",
        distanciaPt: "Estrada Real n.º 1, Azinhaga",
        distanciaEn: "Estrada Real n.º 1, Azinhaga",
        img: "assets/images/piscina.jpg",
        textoPt: "O ponto de partida da sua descoberta. Desfrute da piscina exterior sazonal, dos jardins privativos e da tranquilidade das casas caiadas antes de partir à exploração do Ribatejo.",
        textoEn: "Your starting haven. Enjoy the seasonal outdoor pool, private gardens, and serene whitewashed houses before setting out to explore the Ribatejo region.",
        linkTextoPt: "Reservar Estadia",
        linkTextoEn: "Book Your Stay",
        linkHref: "#reservar"
      },
      {
        tagPt: "Tradição Equestre",
        tagEn: "Equestrian Heritage",
        tituloPt: "Quinta da Brôa & Coudelaria Veiga",
        tituloEn: "Quinta da Brôa & Veiga Stud Farm",
        distanciaPt: "Adjacente à propriedade (1 min)",
        distanciaEn: "Adjacent to the estate (1 min)",
        img: "assets/images/horses.jpg",
        textoPt: "Solar histórico e coudelaria de prestígio internacional. Possibilidade de passeios a cavalo, lições de equitação/dressage e observação das éguas e poldros em liberdade nos pastos verdejantes.",
        textoEn: "Historic manor and world-renowned stud farm. Enjoy horseback excursions, classical dressage lessons, and witness Lusitano mares and foals grazing freely in the lush meadows.",
        linkTextoPt: "Saber Mais",
        linkTextoEn: "Learn More",
        linkHref: "#reservar"
      },
      {
        tagPt: "Cultura & Literatura",
        tagEn: "Literature & Culture",
        tituloPt: "Fundação José Saramago — Aldeia Natal",
        tituloEn: "José Saramago Foundation — Birthplace",
        distanciaPt: "Centro de Azinhaga (3 min / 1.5 km)",
        distanciaEn: "Azinhaga Village Center (3 min / 1.5 km)",
        img: "assets/images/door_detail.jpg",
        textoPt: "Visite a delegação da Fundação José Saramago na terra natal do Nobel da Literatura português. Percorra as memórias de «As Pequenas Memórias» e as oliveiras centenárias que inspiraram o escritor.",
        textoEn: "Visit the José Saramago Foundation delegation in the Nobel laureate's birthplace. Wander through the landscapes of «Small Memories» and the centenary olive trees that inspired him.",
        linkTextoPt: "Explorar Azinhaga",
        linkTextoEn: "Explore Azinhaga",
        linkHref: "https://www.josesaramago.org"
      },
      {
        tagPt: "Natureza & Desporto",
        tagEn: "Nature & Outdoors",
        tituloPt: "Trilhos Ribeirinhos do Tejo & Bicicletas",
        tituloEn: "Tagus River Trails & Cycling",
        distanciaPt: "Acesso direto da propriedade",
        distanciaEn: "Direct access from the property",
        img: "assets/images/21.jpg",
        textoPt: "As Casas da Piedade disponibilizam aluguer de bicicletas para percorrer os diques, caminhos da lezíria e margens do Rio Tejo e Rio Almonda, num contacto íntimo com a fauna e flora locais.",
        textoEn: "Casas da Piedade offers bicycle rental for scenic rides along the river levees, agricultural lanes, and Tagus riverbanks, surrounded by rich biodiversity.",
        linkTextoPt: "Alugar Bicicletas",
        linkTextoEn: "Rent Bikes",
        linkHref: "#reservar"
      },
      {
        tagPt: "Gastronomia & Tradição",
        tagEn: "Gastronomy & Village Life",
        tituloPt: "Vila da Golegã & Sabores do Ribatejo",
        tituloEn: "Golegã Village & Ribatejo Flavors",
        distanciaPt: "10 min de carro (8 km)",
        distanciaEn: "10 min drive (8 km)",
        img: "assets/images/14.jpg",
        textoPt: "Conhecida como a Capital do Cavalo, a Golegã oferece tascas típicas e restaurantes conceituados onde se saboreia a sopa da pedra, magusto, pratos de caça, vinhos do Tejo e doces conventuais.",
        textoEn: "Famous as Portugal's Horse Capital, Golegã offers traditional taverns and acclaimed restaurants serving rich stone soup, local game dishes, Tagus valley wines, and convent sweets.",
        linkTextoPt: "Recomendações Locais",
        linkTextoEn: "Local Dining",
        linkHref: "#reservar"
      },
      {
        tagPt: "Reserva da Biosfera UNESCO",
        tagEn: "UNESCO Biosphere Reserve",
        tituloPt: "Reserva Natural do Paul do Boquilobo",
        tituloEn: "Paul do Boquilobo Biosphere Reserve",
        distanciaPt: "12 min de carro (9 km)",
        distanciaEn: "12 min drive (9 km)",
        img: "assets/images/05.jpg",
        textoPt: "A primeira Reserva da Biosfera declarada pela UNESCO em Portugal. Zona húmida de rara beleza com passadiços de madeira e postos de observação das maiores colónias de garças da Península Ibérica.",
        textoEn: "Portugal's first designated UNESCO Biosphere Reserve. A pristine wetland featuring wooden boardwalks and bird-watching hides overlooking Iberia's greatest heron colonies.",
        linkTextoPt: "Ver Rota",
        linkTextoEn: "View Route",
        linkHref: "#footer-map"
      }
    ];

    function selecionarPin(index) {
      const pins = document.querySelectorAll('.map-pin');
      pins.forEach(p => p.classList.remove('selected'));
      
      const pinAtivo = document.getElementById(`pin-${index}`);
      if (pinAtivo) pinAtivo.classList.add('selected');

      const item = atividadesData[index];
      if (!item) return;

      document.getElementById('det-tag').textContent = idiomaAtual === 'pt' ? item.tagPt : item.tagEn;
      document.getElementById('det-titulo').textContent = idiomaAtual === 'pt' ? item.tituloPt : item.tituloEn;
      document.getElementById('det-distancia').innerHTML = `<span>📍</span> <span>${idiomaAtual === 'pt' ? item.distanciaPt : item.distanciaEn}</span>`;
      document.getElementById('det-img').src = item.img;
      document.getElementById('det-texto').textContent = idiomaAtual === 'pt' ? item.textoPt : item.textoEn;
      
      const linkBtn = document.getElementById('det-link');
      if (linkBtn) {
        linkBtn.textContent = idiomaAtual === 'pt' ? item.linkTextoPt : item.linkTextoEn;
        linkBtn.href = item.linkHref;
      }
    }

    function filtrarMapa(categoria) {
      const chips = document.querySelectorAll('.filter-chip');
      chips.forEach(c => c.classList.remove('active'));
      event.currentTarget.classList.add('active');

      const pins = document.querySelectorAll('.map-pin');
      let primeiroVisivel = null;

      pins.forEach((pin, idx) => {
        const catPin = pin.getAttribute('data-categoria') || '';
        if (categoria === 'todos' || catPin.includes(categoria)) {
          pin.style.display = 'block';
          if (primeiroVisivel === null) primeiroVisivel = idx;
        } else {
          pin.style.display = 'none';
        }
      });

      if (primeiroVisivel !== null) {
        selecionarPin(primeiroVisivel);
      }
    }

    // 4. SISTEMA BILÍNGUE (PT / EN)
    function mudarIdioma(lang) {
      idiomaAtual = lang;
      
      document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
      document.getElementById('btn-en').classList.toggle('active', lang === 'en');
      document.getElementById('m-btn-pt').classList.toggle('active', lang === 'pt');
      document.getElementById('m-btn-en').classList.toggle('active', lang === 'en');

      document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        const txt = el.getAttribute('data-' + lang);
        if (txt) el.innerHTML = txt;
      });

      document.documentElement.lang = lang;

      // Atualizar detalhe do mapa
      const pinSelecionado = document.querySelector('.map-pin.selected');
      if (pinSelecionado) {
        const id = parseInt(pinSelecionado.id.replace('pin-', ''), 10);
        selecionarPin(id);
      }

      // Atualizar placeholders
      if (lang === 'en') {
        document.getElementById('checkin').placeholder = 'Select arrival date';
        document.getElementById('checkout').placeholder = 'Select departure date';
        document.getElementById('nome').placeholder = 'Your full name';
        document.getElementById('observacoes').placeholder = 'Pets, expected arrival time, baby crib...';
        const fn = document.getElementById('faq-nome');
        const fe = document.getElementById('faq-email');
        const fm = document.getElementById('faq-mensagem');
        if (fn) fn.placeholder = 'e.g. Teresa Smith';
        if (fe) fe.placeholder = 'e.g. teresa@example.com';
        if (fm) fm.placeholder = 'How can we help plan your stay?';
      } else {
        document.getElementById('checkin').placeholder = 'Selecione a data';
        document.getElementById('checkout').placeholder = 'Selecione a data';
        document.getElementById('nome').placeholder = 'O seu nome';
        document.getElementById('observacoes').placeholder = 'Animais de estimação, horário previsto de chegada, berço...';
        const fn = document.getElementById('faq-nome');
        const fe = document.getElementById('faq-email');
        const fm = document.getElementById('faq-mensagem');
        if (fn) fn.placeholder = 'ex. Teresa Ferreira';
        if (fe) fe.placeholder = 'ex. teresa@exemplo.com';
        if (fm) fm.placeholder = 'Como podemos ajudar a planear a sua estadia?';
      }
    }

    // 5. FLATPICKR — SELETOR DE DATAS
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof flatpickr !== 'undefined') {
        const checkoutPicker = flatpickr('#checkout', {
          locale: 'pt',
          dateFormat: 'd/m/Y',
          minDate: new Date().fp_incr(1),
          disableMobile: true
        });

        flatpickr('#checkin', {
          locale: 'pt',
          dateFormat: 'd/m/Y',
          minDate: 'today',
          disableMobile: true,
          onChange: function(selectedDates) {
            if (selectedDates[0]) {
              const nextDay = new Date(selectedDates[0].getTime() + 86400000);
              checkoutPicker.set('minDate', nextDay);
            }
          }
        });
      }
    });

    // 6. NAVBAR COMPACTA AO SCROLL & REVELAÇÃO DO BOTÃO RESERVAR
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      // Ao sair do Hero (cerca de 80px ou após a altura do header)
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });

    // 7. MENU MOBILE COM ANIMAÇÃO "X"
    const menuBtn = document.getElementById('menu-btn');
    const mobileDrawer = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuBtn.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    function fecharMenuMobile() {
      mobileDrawer.classList.remove('open');
      menuBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // 8. ANIMAÇÕES REVEAL NO SCROLL
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 9. FORMULÁRIO DE RESERVA
    function enviarPedidoReserva(e) {
      e.preventDefault();
      const checkin = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const tipologia = document.getElementById('tipologia').value;
      const hospedes = document.getElementById('hospedes').value;
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const email = document.getElementById('email').value;
      const observacoes = document.getElementById('observacoes').value;

      const subject = encodeURIComponent(`Pedido de Reserva Casas da Piedade — ${nome} (${tipologia})`);
      const body = encodeURIComponent(
        `Exmos. Senhores das Casas da Piedade,\n\n` +
        `Gostaria de verificar disponibilidade para a seguinte estadia:\n\n` +
        `• Nome: ${nome}\n` +
        `• E-mail: ${email}\n` +
        `• Telefone: ${telefone}\n` +
        `• Check-in: ${checkin}\n` +
        `• Check-out: ${checkout}\n` +
        `• Tipologia: ${tipologia}\n` +
        `• Número de Hóspedes: ${hospedes}\n` +
        (observacoes ? `• Observações: ${observacoes}\n` : '') +
        `\nAgradeço a confirmação de disponibilidade e respetivas condições de reserva.\n\nCom os melhores cumprimentos,\n${nome}`
      );

      window.location.href = `mailto:casasdapiedade@quintadabroa.com?subject=${subject}&body=${body}`;
    }

    // 10. ACORDEÃO DE FAQS & FORMULÁRIO DE DÚVIDAS
    function toggleFaq(button) {
      const item = button.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.toggle('active');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function enviarDuvidaFaq(e) {
      e.preventDefault();
      const feedback = document.getElementById('faq-form-feedback');
      const submitBtn = document.getElementById('faq-submit-btn');
      const nome = document.getElementById('faq-nome') ? document.getElementById('faq-nome').value : '';
      const email = document.getElementById('faq-email') ? document.getElementById('faq-email').value : '';
      const msg = document.getElementById('faq-mensagem') ? document.getElementById('faq-mensagem').value : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }
      if (feedback) {
        feedback.style.display = 'block';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Preparar envio direto para email do alojamento
      const subject = encodeURIComponent(`Dúvida / Questão — ${nome}`);
      const body = encodeURIComponent(
        `Olá Casas da Piedade,\n\nRecebi uma questão através da secção de Perguntas Frequentes:\n\n• Nome: ${nome}\n• E-mail: ${email}\n• Mensagem: ${msg}\n\nObrigado.`
      );

      setTimeout(() => {
        window.location.href = `mailto:casasdapiedade@quintadabroa.com?subject=${subject}&body=${body}`;
        const form = document.getElementById('faq-inquiry-form');
        if (form) form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }, 1200);
    }
  