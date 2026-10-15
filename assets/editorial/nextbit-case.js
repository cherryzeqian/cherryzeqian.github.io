(() => {
  const demos = [...document.querySelectorAll('[data-product-demo]')];
  if (!demos.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const updateLabel = (demo) => {
    const subject = demo.getAttribute('aria-label').split('. Select')[0];
    demo.setAttribute(
      'aria-label',
      `${subject}. Select to ${demo.paused ? 'play' : 'pause'}.`
    );
  };

  const togglePlayback = (demo) => {
    if (demo.paused) {
      demo.dataset.userPaused = 'false';
      demo.play().catch(() => {});
    } else {
      demo.dataset.userPaused = 'true';
      demo.pause();
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const demo = entry.target;
      if (entry.isIntersecting && !reducedMotion.matches && demo.dataset.userPaused !== 'true') {
        demo.play().catch(() => {});
      } else {
        demo.pause();
      }
    });
  }, { threshold: .35 });

  demos.forEach((demo) => {
    demo.dataset.userPaused = 'false';
    demo.addEventListener('click', () => togglePlayback(demo));
    demo.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      togglePlayback(demo);
    });
    demo.addEventListener('play', () => updateLabel(demo));
    demo.addEventListener('pause', () => updateLabel(demo));
    updateLabel(demo);
    observer.observe(demo);
  });
})();
