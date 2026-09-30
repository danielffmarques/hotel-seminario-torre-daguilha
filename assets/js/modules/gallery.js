/**
 * Hotel Seminário Torre d'Aguilha - Gallery Module
 * Troca dinâmica de fotografias a partir de miniaturas interativas nas tipologias de quartos.
 */

export function initGallery() {
  const roomThumbBtns = document.querySelectorAll('.room-thumb-btn');
  if (roomThumbBtns.length === 0) return;

  roomThumbBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const fullSrc = btn.getAttribute('data-full');
      const altText = btn.getAttribute('data-alt') || '';
      const mainImg = document.getElementById(targetId);

      if (mainImg && fullSrc) {
        mainImg.classList.add('opacity-40');
        setTimeout(() => {
          mainImg.src = fullSrc;
          if (altText) mainImg.alt = altText;
          mainImg.classList.remove('opacity-40');
        }, 150);

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
}
