import { LocatorSelectSearchClass } from './locator-select-search-class.js';
export class LocatorSelectClass {
  constructor(options) {
    this.elRootCn = 'ac-core-locator-select';
    this.name = options.name;
    this.el = options.el || null;
    this.initializationClass = 'locator-select--initialization';
    this.selectOptionEvent = options.selectOptionEvent;
    this.useSearch = options.useSearch || false;
    this.placeholder = options.placeholder;
    this.searchPlaceholder = options.searchPlaceholder;

    this.searchInstanse = null;

    this.disableDropdownFlag = false;
    this.disableClassname = 'disable';

    this.selectors = {
      toggler: null,
      togglerText: null,
      dropdown: null,
      dropdownList: null,
    };

    this._listItems = [];

    this._selectedOption = null;
    this._selectedDataLinkOption = null;

    this.classNamesSelectors = {
      openedSelectState: `${this.elRootCn}--opened`,
      activeToggleState: `${this.elRootCn}__toggler--active`,
      toggler: `${this.elRootCn}__toggler`,
      togglerText: `cmp-button__text`,
      dropdown: `${this.elRootCn}__dropdown`,
      dropdownActive: `${this.elRootCn}__dropdown--active`,
      dropdownList: `${this.elRootCn}__dropdown-list`,
      dropdownListItem: `${this.elRootCn}__dropdown-list-item`,
      dropdownListItemActive: `${this.elRootCn}__dropdown-list-item--active`,
      dropdownListLinkItem: `${this.elRootCn}__dropdown-list-link-item`,
      dropdownListActive: `${this.elRootCn}__dropdown-list--active`,

      dropdownSelectRoot: '',
    };

    this.dataAttrNames = {
      name: 'data-name',
      link: 'data-link',
    };

    //events
    this.events = {
      selectOptionEvent: null,
      searchInputEvent: 'inputSearch',
      searchSubmitEvent: 'submitSearch',
      searchEnterSubmitEvent: 'submitEnterSearch',
    };

    this.init();
  }

  set disableDropdown(value) {
    this.disableDropdownFlag = value;

    if (value) {
      this.selectors.toggler.classList.add(this.disableClassname);
    } else {
      this.selectors.toggler.classList.remove(this.disableClassname);
    }
  }

  get selectedOption() {
    return this._selectedOption;
  }

  set selectedOption(value) {
    this._selectedOption = value;
    this.selectors.togglerText.innerText = value;
    this.isOpen = false;
    this._setActiveListOption(value);
  }

  get selectedDataLinkOption() {
    return this._selectedDataLinkOption;
  }

  set selectedDataLinkOption(value) {
    this._selectedDataLinkOption = value;
  }

  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value) {
    if (value) {
      this.el.classList.add(this.classNamesSelectors.openedSelectState);
      this.selectors.toggler.parentNode.classList.add(this.classNamesSelectors.activeToggleState);
      this.selectors.dropdown.classList.add(this.classNamesSelectors.dropdownActive);
    } else {
      this.el.classList.remove(this.classNamesSelectors.openedSelectState);
      this.selectors.toggler.parentNode.classList.remove(this.classNamesSelectors.activeToggleState);
      this.selectors.dropdown.classList.remove(this.classNamesSelectors.dropdownActive);
    }
    this._isOpen = value;
  }

  init() {
    if (!this.el) return;
    if (this.el.classList.contains(this.initializationClass)) return;

    this._setupElements();
    this._setupEvents();
    this._setupDynamicContent();

    this.el.classList.add(this.initializationClass);
  }

  setListItems(items) {
    this._listItems = items;
    this.clearListItems();

    if (!this.selectors.dropdownList) return;

    for (const item of items) {
      this.selectors.dropdownList.appendChild(this._getGeneratedDropdownListItem(item));
    }
  }

  resetValue() {
    this.selectedOption = this.placeholder;
    this.selectedDataLinkOption = '';
  }

  clearListItems() {
    if (this.selectors.dropdownList) {
      this.selectors.dropdownList.innerHTML = '';
    }
  }

  // private methods
  _setupEvents() {
    this._escHandleCloseMenuListener();
    this._closeMenuClickOutsideListener();
    this._toggleButtonListener();
    this._selectOptionListener();
    if (this.useSearch) {
      this._searchListener();
    }
  }

  _setupDynamicContent() {
    const toggletTextEl = this.selectors.toggler.querySelector('.cmp-button__text');
    toggletTextEl.innerText = this.placeholder;
  }

  _searchListener() {
    document.addEventListener(this.events.searchInputEvent, (e) => {
      this._filterListByText(e.detail);
    });
    document.addEventListener(this.events.searchSubmitEvent, (e) => {
      this._setCustomValueSelect(e.detail);
    });
    document.addEventListener(this.events.searchEnterSubmitEvent, (e) => {
      this._setCustomValueSelect(e.detail);
    });
  }

  _selectOptionListener() {
    this.selectors.dropdownList.addEventListener('click', (e) => {
      e.preventDefault();
      this._selectOption(e);
    });
    this.selectors.dropdownList.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this._selectOption(e);
      }
    });
  }

  _toggleButtonListener() {
    this.selectors.toggler.addEventListener('click', () => {
      if (this.disableDropdownFlag) {
        return;
      }
      this.isOpen = !this.isOpen;
    });
  }

  _escHandleCloseMenuListener() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      e = e || window.event;
      if (e.keyCode == 27) {
        this.isOpen = false;
      }
    });
  }

  _closeMenuClickOutsideListener() {
    window.addEventListener('click', (e) => {
      if (this.isOpen && !this.el.contains(e.target)) {
        this.isOpen = false;
      }
    });
  }

  _setupElements() {
    this.selectors.toggler = this.el.querySelector(`.${this.classNamesSelectors.toggler} > .cmp-button`);
    this.selectors.togglerText = this.selectors.toggler.querySelector(`.${this.classNamesSelectors.togglerText}`);
    const dropdown = this._getGeneratedDropdown();
    this.selectors.toggler.after(dropdown);

    if (this.useSearch) {
      this.searchInstanse = new LocatorSelectSearchClass({
        container: dropdown,
        name: 'country-search',
        placeholder: this.searchPlaceholder,
      });
    }
  }

  _getGeneratedDropdown() {
    const dropdown = document.createElement('div');
    const dropdownList = document.createElement('ul');
    dropdown.classList.add(this.classNamesSelectors.dropdown);
    dropdownList.classList.add(this.classNamesSelectors.dropdownList);
    dropdown.appendChild(dropdownList);

    this.selectors.dropdown = dropdown;
    this.selectors.dropdownList = dropdownList;

    return dropdown;
  }

  _getGeneratedDropdownListItem(props) {
    const dropdownListItem = document.createElement('li');

    dropdownListItem.classList.add(this.classNamesSelectors.dropdownListItem);
    dropdownListItem.setAttribute('tabindex', 0);

    if (typeof props === 'object') {
      dropdownListItem.setAttribute(this.dataAttrNames.link, props.link);
      dropdownListItem.setAttribute(this.dataAttrNames.name, props.title);
      dropdownListItem.innerText = props.title;
    } else {
      dropdownListItem.innerText = props;
      dropdownListItem.setAttribute(this.dataAttrNames.name, props);
    }
    return dropdownListItem;
  }

  _filterListByText(text) {
    const $listItems = this.selectors.dropdownList.children;

    for (const item of $listItems) {
      if (!item.innerText.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
      }
    }
  }

  _selectOption(e) {
    const el = e.srcElement;
    const value = el.innerText || el.innerHTML;
    this.selectedOption = value;
    const dataLink = e.target.getAttribute(this.dataAttrNames.link);
    this._selectValueEvent(value, dataLink);
  }

  _selectValueEvent(value, link) {
    this.selectedOption = value;
    this.selectedDataLinkOption = link;

    if (this.useSearch) {
      this._resetList();
    }
    const event = new CustomEvent(this.selectOptionEvent, {
      detail: {
        value,
        link,
      },
    });
    document.dispatchEvent(event);
  }

  _setCustomValueSelect(value) {
    const filteredItems = this._listItems.filter((item) =>
      item.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    );
    if (!filteredItems.length) {
      this._selectValueEvent(value);
    }
  }

  _resetList() {
    this.searchInstanse.clearText();
    this._filterListByText('');
  }

  _setActiveListOption(value) {
    const items = this.selectors.dropdownList.children;

    for (const item of items) {
      item.classList.remove(this.classNamesSelectors.dropdownListItemActive);
    }

    for (const item of items) {
      const name = item.getAttribute(this.dataAttrNames.name);
      if (name.toLocaleLowerCase() === value.toLocaleLowerCase()) {
        item.classList.add(this.classNamesSelectors.dropdownListItemActive);
      }
    }
  }
}
