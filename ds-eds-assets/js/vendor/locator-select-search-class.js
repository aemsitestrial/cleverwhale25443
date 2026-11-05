export class LocatorSelectSearchClass {
  constructor(options) {
    this.container = options.container;
    this.name = options.name;
    this.placeholder = options.placeholder;

    this._baseSearch = 'ac-core-locator-search';
    this._isFocused = false;
    this._valueText = '';

    // selectors
    this.selectors = {
      root: null,
      input: null,
      results: null,
      button: null,
    };

    // classnames
    this.classNames = {
      root: this._baseSearch,
      focus: `${this._baseSearch}--focused`,
      input: `${this._baseSearch}__input`,
      inputInner: `${this._baseSearch}__input-inner`,
      button: `${this._baseSearch}__button`,
      buttonIcon: `${this._baseSearch}__button-icon`,
    };

    // classname selectors
    this.classNameSelectors = {
      input: `${this._baseSearch}__input`,
    };

    //events
    this.events = {
      focusEvent: null,
      inputEvent: null,
      submitEvent: null,
    };

    //events names
    this.eventNames = {
      focus: 'focusSearch',
      input: 'inputSearch',
      submit: 'submitSearch',
      submitEnter: 'submitEnterSearch',
    };

    this.init();
  }

  get searchText() {
    return this._valueText;
  }

  set searchText(value) {
    this._valueText = value;
    this.selectors.input.value = value;
  }

  get focused() {
    return this._isFocused;
  }

  set focused(value) {
    if (value) {
      this.selectors.root.classList.add(this.classNames.focus);
      this.selectors.input.focus();
    } else {
      this.selectors.root.classList.remove(this.classNames.focus);
    }
    this._isFocused = value;
  }

  init() {
    if (!this.container) return;
    this.container.prepend(this._getGeneratedSearch(this.name, this.placeholder));

    this.setupCustomEvents();
    this.setupEventListeners();
  }

  clearText() {
    this.searchText = '';
  }

  setupCustomEvents() {
    this.events.focusEvent = new CustomEvent(this.eventNames.focus);
  }

  setupEventListeners() {
    this._focusStateEventListener();
    this._blurStateEventListener();
    this._inputEventListener();
    this._submitEventListener();
  }

  _focusStateEventListener() {
    document.addEventListener(
      'focus',
      (e) => {
        if (e.target !== this.selectors.input) return;
        this.focused = true;
      },
      true,
    );
  }

  _blurStateEventListener() {
    document.body.addEventListener(
      'click',
      (e) => {
        if (e.target !== this.selectors.input && this._isFocused) {
          this.focused = false;
          return;
        }
      },
      true,
    );
  }

  _inputEventListener() {
    this.selectors.input.addEventListener('input', (e) => {
      const value = e.target.value || e.currentTarget.value;
      this.searchText = value;
      const event = new CustomEvent(this.eventNames.input, { detail: value });
      document.dispatchEvent(event);
    });
  }

  _submitEventListener() {
    this.selectors.button.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(
        new CustomEvent(this.eventNames.submit, {
          detail: this.searchText,
        }),
      );
    });
    this.selectors.input.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.key === 'Enter') {
        document.dispatchEvent(
          new CustomEvent(this.eventNames.submit, {
            detail: this.searchText,
          }),
        );
      }
    });
  }

  _getGeneratedSearch(name, placeholder) {
    const selectRoot = document.createElement('div');
    selectRoot.classList.add(this.classNames.root);
    this.selectors.root = selectRoot;

    const selectInner = document.createElement('div');
    selectInner.classList.add(this.classNames.inputInner);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholder;
    input.classList.add(this.classNames.input);
    input.setAttribute('name', name);
    this.selectors.input = input;

    const button = document.createElement('button');
    button.classList.add(this.classNames.button);
    this.selectors.button = button;
    const buttonIcon = document.createElement('span');
    buttonIcon.classList.add(this.classNames.buttonIcon);

    selectRoot.appendChild(selectInner);
    button.appendChild(buttonIcon);
    selectInner.appendChild(input);
    selectInner.appendChild(button);

    return selectRoot;
  }
}
