document.addEventListener('DOMContentLoaded', () => {
  console.log('Sonda Collective Landing Page Loaded');

  // Elementos do DOM
  const h1 = document.querySelector('.hero-text h1');
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModalbutt');
  const closeBtn = document.querySelector('.close-btn');
  const form = document.getElementById('formulario');
  const inputs = form ? form.querySelectorAll('input[required], select[required]') : [];
  const telInput = document.getElementById('telefone');
  const follower = document.querySelector('.mouse-follower'); // Para o mouse-follower

  // Depuração para verificar se os elementos estão sendo encontrados
  console.log('Modal:', modal);
  console.log('Open Modal Button:', openModalBtn);
  console.log('Close Button:', closeBtn);
  console.log('Form:', form);
  console.log('Inputs:', inputs);
  console.log('Telefone Input:', telInput);
  console.log('Mouse Follower:', follower);

  // Desativar o botão inicialmente
  if (openModalBtn) {
    openModalBtn.disabled = true;
    openModalBtn.style.opacity = '0.5';
    openModalBtn.style.cursor = 'not-allowed';
  } else {
    console.warn('Botão openModalbutt não encontrado');
  }

  // IntersectionObserver para animação do h1
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (h1) {
    observer.observe(h1);
  } else {
    console.warn('Elemento .hero-text h1 não encontrado');
  }

  // Máscara de telefone
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }

      e.target.value = value;
    });
  } else {
    console.warn('Elemento #telefone não encontrado');
  }

  // Função para validar telefone
  function validarTelefone(tel) {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(tel);
  }

  // Função para checar se todos os campos estão preenchidos
  function todosCamposPreenchidos() {
    return Array.from(inputs).every((input) => {
      if (input === telInput) {
        const isValidTel = validarTelefone(input.value.trim());
        console.log(`Telefone: ${input.value}, válido? ${isValidTel}`);
        return isValidTel;
      }
      const isValid = input.tagName === 'SELECT' ? input.value !== '' : input.value.trim() !== '';
      console.log(`Campo ${input.id || input.name}: ${input.value}, Válido: ${isValid}`);
      return isValid;
    });
  }

  // Monitorar mudanças nos campos do formulário
  if (inputs.length > 0) {
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        console.log('Evento input disparado para:', input.id || input.name);
        if (todosCamposPreenchidos()) {
          console.log('Todos os campos preenchidos, habilitando botão');
          openModalBtn.disabled = false;
          openModalBtn.style.opacity = '1';
          openModalBtn.style.cursor = 'pointer';
        } else {
          console.log('Nem todos os campos preenchidos, desativando botão');
          openModalBtn.disabled = true;
          openModalBtn.style.opacity = '0.5';
          openModalBtn.style.cursor = 'not-allowed';
        }
      });
      // Disparar evento inicial para verificar estado inicial
      input.dispatchEvent(new Event('input'));
    });
  } else {
    console.warn('Nenhum campo obrigatório encontrado no formulário');
  }

  // Abertura do modal
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      if (todosCamposPreenchidos()) {
        modal.classList.remove('hide');
        modal.classList.add('show');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('fade-in'), 10);
      } else {
        alert('Por favor, preencha todos os campos antes de continuar.');
      }
    });
  }

  // Função para fechar o modal
  function closeModal() {
    if (modal) {
      modal.classList.remove('show', 'fade-in');
      modal.classList.add('fade-out');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fade-out');
      }, 300);
    }
  }

  // Fechar modal com botão
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  } else {
    console.warn('Botão .close-btn não encontrado');
  }

  // Fechar modal clicando fora
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Efeito de blur nas feedback cards
  const cards = document.querySelectorAll('.feedback-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => {
        c.classList.add('blurred');
        c.classList.remove('focused');
      });
      card.classList.remove('blurred');
      card.classList.add('focused');
    });

    card.addEventListener('mouseleave', () => {
      cards.forEach(c => {
        c.classList.remove('blurred', 'focused');
      });
    });
  });

  // Mouse Follower
  if (follower) {
    // Atualiza a posição do elemento com base no mouse
    document.addEventListener('mousemove', (e) => {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    });

    // Detecta elementos clicáveis
    const clickableElements = document.querySelectorAll('a, button, [onclick], .feedback-card, .method-card');
    
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        follower.classList.add('active');
      });
      element.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
      });
    });
  } else {
    console.error('Elemento .mouse-follower não encontrado no DOM.');
  }
});

const nav = document.querySelector('nav ul');
const hamburger = document.createElement('div');
hamburger.className = 'hamburger';
hamburger.innerHTML = '☰';
document.querySelector('nav').prepend(hamburger);

hamburger.addEventListener('click', () => {
  nav.classList.toggle('active');
});
