(() => {
  const images = [...document.querySelectorAll('.case img:not([aria-hidden="true"]):not([data-no-lightbox])')];
  if (!images.length) return;

  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-hidden', 'true');
  viewer.setAttribute('aria-label', 'Expanded project image');
  viewer.innerHTML = '<button class="image-viewer-close" type="button" aria-label="Close expanded image">×</button><div class="image-viewer-stage"></div><p class="image-viewer-caption"></p>';
  document.body.append(viewer);

  const closeButton = viewer.querySelector('.image-viewer-close');
  const stage = viewer.querySelector('.image-viewer-stage');
  const caption = viewer.querySelector('.image-viewer-caption');
  let lastTrigger = null;

  function closeViewer() {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    stage.replaceChildren();
    document.body.classList.remove('image-viewer-open');
    lastTrigger?.focus();
  }

  function openViewer(trigger) {
    lastTrigger = trigger;
    const sources = (trigger.dataset.fullSrcs || trigger.dataset.fullSrc || trigger.currentSrc || trigger.src)
      .split('|')
      .filter(Boolean);
    const crops = (trigger.dataset.fullCrops || '').split('|');
    stage.replaceChildren(...sources.map((source, index) => {
      const expanded = document.createElement('img');
      expanded.src = source;
      expanded.alt = trigger.alt || '';
      expanded.decoding = 'async';
      if (crops[index]) {
        const crop = document.createElement('div');
        crop.className = 'image-viewer-crop';
        crop.dataset.crop = crops[index];
        crop.append(expanded);
        return crop;
      }
      return expanded;
    }));
    stage.classList.toggle('is-gallery', sources.length > 1);
    caption.textContent = trigger.alt || 'Project image';
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('image-viewer-open');
    closeButton.focus();
  }

  images.forEach((image) => {
    image.dataset.lightboxReady = 'true';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt || 'Project image'}: click to enlarge`);
    image.decoding = 'async';
    image.addEventListener('click', () => openViewer(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openViewer(image);
      }
    });
  });

  closeButton.addEventListener('click', closeViewer);
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && viewer.classList.contains('is-open')) closeViewer();
  });
})();
