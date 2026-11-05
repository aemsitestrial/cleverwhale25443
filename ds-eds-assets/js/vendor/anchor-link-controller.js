// To use this controller import it in your main js
// and run: new AnchorLinkController().init();

function changeHashWithoutScrolling(hash) {
  const targetId = hash.replace(/^.*#/, '');
  const target = document.getElementById(targetId);
  if (target) {
    target.id = targetId + '-tmp';
    window.location.hash = hash;
    target.id = targetId;
  }
}

export class AnchorLinkController {
  constructor(options) {
    this.options = options;
  }

  init() {
    const elements = document.querySelectorAll("a[href^='#']");
    elements.forEach((el) => {
      el.addEventListener('click', (event) => {
        const targetId = el.getAttribute('href').split('#')[1] || '';
        const target = document.getElementById(targetId);
        if (!target) {
          console.error('Target id', targetId, 'not found');
          return;
        }

        event.preventDefault();
        var targetPosition = target.getBoundingClientRect().top;
        var offsetPosition = targetPosition + window.scrollY - this.options.headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        changeHashWithoutScrolling(`#${targetId}`);
      });
    });

    const hash = window.location.hash;
    const targetId = hash.replace('#', '');
    window.location.hash = '';

    if (targetId) {
      setTimeout(() => {
        const target = document.getElementById(targetId);

        if (!target) {
          console.error('Target id', targetId, 'not found');
          return;
        }

        var targetPosition = target.getBoundingClientRect().top;
        var offsetPosition = targetPosition + window.scrollY - this.options.headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'instant',
        });

        changeHashWithoutScrolling(hash);
      }, 0);
    }
  }
}

export default AnchorLinkController;
