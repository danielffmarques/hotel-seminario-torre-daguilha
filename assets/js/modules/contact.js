/**
 * Hotel Seminário Torre d'Aguilha - Contact Module
 * Gestão de submissão dos formulários de contacto rápido e dúvidas.
 */

export function initContactForms() {
  const questionForms = document.querySelectorAll('.question-form');
  questionForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('input[type="text"]')?.value || 'Estimado(a)';
      alert(`Obrigado pelo seu contacto, ${name}!\nA nossa equipa responderá à sua questão com brevidade para o email indicado.`);
      form.reset();
    });
  });
}
