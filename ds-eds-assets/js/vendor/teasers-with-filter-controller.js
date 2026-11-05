class BlockTeasersWithFilterSingleController {
  constructor(options) {
    this.el = options.el || null;
    this.cards = [];
    this.cardsContainer = this.el.querySelector('.ac-core-block-teasers-with-filter-cards') || null;
    this.searchContainer = this.el.querySelector('.ac-core-filter .cmp-container') || null;

    this.initializationClass = 'block-teasers-with-filter--initialized';
    this.searchContainerClass = 'ac-core-filter-input';

    this.notFoundText = '';
    this.notFoundElement = null;

    this.init();
  }

  init() {
    if (!this.el) return;
    if (!this.searchContainer || !this.cardsContainer) return;

    const listItems = this.cardsContainer.querySelectorAll(
      '.ac-core-block-teasers-with-filter-cards .aem-Grid .cmp-list__item',
    );
    const aemGrid = this.cardsContainer.querySelector('.ac-core-block-teasers-with-filter-cards .aem-Grid');
    this.cards = listItems.length ? Array.from(listItems) : aemGrid ? Array.from(aemGrid.children) : [];

    if (!this.cards.length) return;
    if (this.el.classList.contains(this.initializationClass)) {
      return;
    }

    this.generateNotFoundTextElement();
    this.generateSearch();

    this.el.classList.add(this.initializationClass);
  }

  searchFieldEvent(value) {
    let visibleCardsCount = 0;

    this.cards.forEach((card) => {
      const text = card.textContent.toLowerCase();

      const isVisible = text.includes(value);

      card.style.display = isVisible ? '' : 'none';

      if (isVisible) {
        visibleCardsCount += 1;
      }
    });

    if (!this.notFoundElement) return;
    if (visibleCardsCount === 0) {
      this.cardsContainer.appendChild(this.notFoundElement);
    } else {
      this.notFoundElement.remove();
    }
  }

  // The Text is optional: a filter without one shows no message when nothing matches.
  generateNotFoundTextElement() {
    const notFoundTextEl = this.searchContainer.querySelector('.text');
    if (!notFoundTextEl) return;
    const notFoundText = notFoundTextEl.querySelector('.cmp-text p')?.textContent.trim();
    notFoundTextEl.remove();

    const el = document.createElement('div');
    el.classList.add('ac-core-block-teasers-with-filter-not-found');
    el.textContent = notFoundText;

    this.notFoundElement = el;
  }

  // The Title is optional: a filter without one has an input with no placeholder.
  generateSearch() {
    const placeholderTitleEl = this.searchContainer.querySelector('.title');
    const placeholderText = placeholderTitleEl?.querySelector('.cmp-title__text')?.textContent.trim();
    placeholderTitleEl?.remove();

    const searchInput = document.createElement('input');
    const searchContainer = document.createElement('div');
    searchContainer.classList.add(this.searchContainerClass);

    searchInput.type = 'text';
    if (placeholderText) searchInput.placeholder = placeholderText;

    searchInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase().trim();

      this.searchFieldEvent(value);
    });

    searchContainer.appendChild(searchInput);

    this.searchContainer.appendChild(searchContainer);
  }
}

export class BlockTeasersWithFilterController {
  constructor(options) {
    this.options = options;

    this.blockClass = 'ac-core-block-teasers-with-filter';
  }

  init() {
    const elements = document.querySelectorAll(`.${this.blockClass}`);
    elements.forEach(
      (el) =>
        new BlockTeasersWithFilterSingleController({
          el: el,
        }),
    );
  }
}

export default BlockTeasersWithFilterController;
