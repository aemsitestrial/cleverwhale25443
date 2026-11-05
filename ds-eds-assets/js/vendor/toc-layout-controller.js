import { getTotalMarginsForChildren, scrollIntoView, getElementById, getElementIndexById, } from './toc-layout-utils.js';
export class BlockTableOfContentLayoutController {
    constructor() {
        this.STATE_OPTIONS = {
            BEFORE: 'before',
            INSIDE: 'inside',
            AFTER: 'after',
        };
        this.classNames = {
            root: 'ds-brand-block-toc-layout',
            initialization: 'ds-brand-block-toc-layout--initialize',
            sidebarContainer: 'ds-brand-block-toc-layout-sidebar',
            stickyContainer: 'ds-brand-sticky-container',
            linkNavigationActive: 'active',
            navigationRoot: 'tableofcontents',
            navigationListContainer: 'cmp-toc__content',
            navigationLinkCompleted: 'completed',
            toggler: 'cmp-toc__toggler',
            togglerText: 'cmp-toc__toggler-text',
            togglerActive: 'active',
            reserveSpace: 'cmp-toc__reserve-space',
        };
        this.events = {
            headerHeightTrigger: 'headerHeightTrigger',
        };
        this.elements = {
            root: null,
            sidebarContainer: null,
            stickyContainer: null,
            stickyContainerInner: null,
            navigationRoot: null,
            toggler: null,
            navigationListContainer: null,
        };
        this.currentState = null;
        this.headingElementsOnPage = [];
        this.observer = null;
        this.currentState = null;
        this.headingElementsOnPage = [];
        this.navigationLinksElements = null;
        this.hasAtLeastOneNavigationId = false;
        this.isReservedSpace = false;
        this.breakpoint = 1280;
        this.isMobileScreen = window.matchMedia(`(max-width: ${this.breakpoint - 1}px)`).matches;
        this.topSpaceDesktopSidebar = 10;
        this.extraTopDistance = 0;
        this.containerTopDistance = 0;
        this.containerBottomDistance = 0;
        this.totalMaringsInSidebar = 0;
    }
    set extraTopDistanceValue(value) {
        this.extraTopDistance = value;
    }
    init() {
        const root = document.querySelector(`.${this.classNames.root}`);
        if (!root)
            return;
        this.elements.root = root;
        if (this.elements.root.classList.contains(this.classNames.initialization))
            return;
        this.setupElements();
        this.setupNavigationLinksElements();
        if (!this.navigationLinksElements || !this.hasAtLeastOneNavigationId)
            return;
        this.generateMobileMenuToggler();
        if (this.isMobileScreen) {
            this.setupMobileNavigation();
        }
        else {
            this.setupSidebarSticky();
        }
        this.scrollEvent();
        this.resizeEvent();
        this.customEvent();
        this.createObserveSections();
        this.navigationLinksEventClick();
        this.elements.root.classList.add(this.classNames.initialization);
    }
    // BASE METHODS
    setupElements() {
        this.elements.sidebarContainer = this.elements.root?.querySelector(`.${this.classNames.sidebarContainer}`) ?? null;
        if (this.elements.sidebarContainer) {
            this.elements.stickyContainer = this.elements.sidebarContainer.querySelector(`.${this.classNames.stickyContainer}`);
        }
        if (this.elements.stickyContainer) {
            this.elements.stickyContainerInner = this.elements.stickyContainer.querySelector('.cmp-container');
        }
        if (this.elements.stickyContainer) {
            this.elements.navigationRoot = this.elements.stickyContainer.querySelector(`.${this.classNames.navigationRoot}`);
        }
        if (this.elements.navigationRoot) {
            this.elements.navigationListContainer = this.elements.navigationRoot?.querySelector(`.${this.classNames.navigationListContainer}`);
        }
    }
    setupSidebarSticky() {
        this.setSidebarNavigationDynamicHeightDesktop();
        this.recalculateContainerBoundsDesktop();
        this.updateStickyPositionDesktop();
    }
    setupMobileNavigation() {
        this.recalculateContainerBoundsMobile();
        this.updateStickyPositionMobile();
    }
    scrollEvent() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking)
                return;
            ticking = true;
            requestAnimationFrame(() => {
                if (this.isMobileScreen) {
                    this.updateStickyPositionMobile();
                }
                else {
                    this.updateStickyPositionDesktop();
                }
                ticking = false;
            });
        }, { passive: true });
    }
    resizeEvent() {
        let timeout = null;
        window.addEventListener('resize', () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                this.isMobileScreen = window.matchMedia(`(max-width: ${this.breakpoint - 1}px)`).matches;
                if (this.isMobileScreen) {
                    this.resetStylesStickySidebar();
                    this.setupMobileNavigation();
                }
                else {
                    this.unreserveSpaceMobileMenuToggler();
                    this.setupSidebarSticky();
                }
            }, 100);
        });
    }
    customEvent() {
        document.addEventListener(this.events.headerHeightTrigger, (e) => {
            const customEvent = e;
            requestAnimationFrame(() => {
                if (this.isMobileScreen) {
                    this.extraTopDistance = customEvent.detail.height;
                    this.updateStickyPositionMobile();
                }
                else {
                    this.extraTopDistance = customEvent.detail.height + this.topSpaceDesktopSidebar;
                    this.updateStickyPositionDesktop();
                }
                this.createObserveSections();
            });
        });
    }
    createObserveSections() {
        const root = this.elements.navigationRoot;
        const links = this.navigationLinksElements;
        if (!root || !links)
            return;
        let observer = this.observer;
        if (observer) {
            observer.disconnect();
        }
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                const id = entry.target.id;
                if (entry.isIntersecting) {
                    this.activateSection(id);
                    const el = getElementById(links, id);
                    if (!el)
                        return;
                    scrollIntoView(root, el);
                }
            }
        }, {
            root: null,
            threshold: 0,
            rootMargin: '-50% 0px -20% 0px',
        });
        this.headingElementsOnPage.forEach((el) => {
            observer?.observe(el);
        });
    }
    navigationLinksEventClick() {
        if (!this.navigationLinksElements) {
            throw new Error('navigationLinksElements is empty');
        }
        this.navigationLinksElements.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget;
                const selectorId = target.getAttribute('href');
                this.toggleNavigationContent(false);
                this.scrollToElementByid(selectorId);
            });
        });
    }
    //////////////////////////////
    activateSection(currentId) {
        if (!this.navigationLinksElements)
            return;
        const currentIndex = getElementIndexById(this.headingElementsOnPage, currentId);
        this.navigationLinksElements.forEach((linkItem, index) => {
            const liElement = linkItem.parentNode;
            if (index < currentIndex) {
                liElement.classList.add(this.classNames.navigationLinkCompleted);
            }
            else {
                liElement.classList.remove(this.classNames.navigationLinkCompleted);
            }
            if (linkItem.getAttribute('href') === `#${currentId}`) {
                liElement.classList.add(this.classNames.linkNavigationActive);
                const togglerText = this.elements.stickyContainer?.querySelector(`.${this.classNames.togglerText}`);
                if (togglerText) {
                    togglerText.innerText = linkItem.innerText;
                }
            }
            else {
                liElement.classList.remove(this.classNames.linkNavigationActive);
            }
        });
    }
    activateFirstSection() {
        if (!this.navigationLinksElements)
            return;
        this.navigationLinksElements.forEach((linkItem, index) => {
            const liElement = linkItem.parentNode;
            if (index === 0) {
                liElement.classList.remove(this.classNames.navigationLinkCompleted);
                liElement.classList.add(this.classNames.linkNavigationActive);
            }
            else {
                liElement.classList.remove(this.classNames.linkNavigationActive);
                liElement.classList.remove(this.classNames.navigationLinkCompleted);
            }
        });
    }
    setupNavigationLinksElements() {
        if (!this.elements.navigationRoot)
            return;
        const linkItems = this.elements.navigationRoot?.querySelectorAll('a');
        if (!linkItems.length)
            return;
        const headingElementsOnPage = [];
        linkItems.forEach((link) => {
            const linkHrefId = link.getAttribute('href');
            if (!linkHrefId)
                return;
            const headingEl = document.getElementById(linkHrefId.substring(1));
            if (headingEl === null || headingEl === undefined)
                return;
            if (headingEl) {
                headingElementsOnPage.push(headingEl);
            }
        });
        this.hasAtLeastOneNavigationId = !!headingElementsOnPage.length;
        this.navigationLinksElements = linkItems;
        this.headingElementsOnPage = headingElementsOnPage;
    }
    scrollToElementByid(idSelector) {
        const el = this.elements.root?.querySelector(`[id="${idSelector.replace('#', '')}"]`);
        if (!el)
            return;
        const startScroll = window.scrollY || document.documentElement.scrollTop;
        const duration = 600;
        const startTime = performance.now();
        let mobileTogglerHeight = 0;
        if (this.isMobileScreen) {
            mobileTogglerHeight = this.elements.toggler?.offsetHeight || 0;
        }
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const rect = el.getBoundingClientRect();
            const currentTarget = rect.top + window.scrollY - this.extraTopDistance - mobileTogglerHeight;
            const currentScroll = startScroll + (currentTarget - startScroll) * ease;
            window.scrollTo(0, currentScroll);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
            else {
                requestAnimationFrame(() => {
                    this.activateSection(el.id);
                });
            }
        };
        requestAnimationFrame(step);
    }
    // DESKTOP UPDATE STICKY STATE
    updateStickyPositionDesktop() {
        this.defineViewportPosition();
        if (this.currentState === this.STATE_OPTIONS.BEFORE) {
            this.resetStylesStickySidebar();
            this.activateFirstSection();
            return;
        }
        if (this.currentState === this.STATE_OPTIONS.INSIDE) {
            this.stateInsideContainerDesktop();
            this.recalculateSidebarPositionOnDesktop();
            return;
        }
        if (this.currentState === this.STATE_OPTIONS.AFTER) {
            this.stateAfterContainerDesktop();
            return;
        }
    }
    defineViewportPosition() {
        const topDistance = this.getTopDistance();
        const topDistanceWithStickyContainerHeight = topDistance + (this.elements.stickyContainer?.offsetHeight || 0);
        if (topDistance < this.containerTopDistance) {
            if (this.currentState !== this.STATE_OPTIONS.BEFORE) {
                this.currentState = this.STATE_OPTIONS.BEFORE;
                return;
            }
        }
        if (topDistance > this.containerTopDistance &&
            topDistanceWithStickyContainerHeight < this.containerBottomDistance) {
            if (this.currentState !== this.STATE_OPTIONS.INSIDE) {
                this.currentState = this.STATE_OPTIONS.INSIDE;
                return;
            }
        }
        if (topDistanceWithStickyContainerHeight > this.containerBottomDistance) {
            if (this.currentState !== this.STATE_OPTIONS.AFTER) {
                this.currentState = this.STATE_OPTIONS.AFTER;
                return;
            }
        }
    }
    resetStylesStickySidebar() {
        if (!this.elements.stickyContainer)
            return;
        const style = this.elements.stickyContainer.style;
        style.position = '';
        style.top = '';
        style.left = '';
        style.width = '';
    }
    stateInsideContainerDesktop() {
        if (!this.elements.sidebarContainer || !this.elements.stickyContainer)
            return;
        const sidebarContainerRect = this.elements.sidebarContainer.getBoundingClientRect();
        this.elements.stickyContainer.style.position = 'fixed';
        this.elements.stickyContainer.style.top = `${this.extraTopDistance}px`;
        this.elements.stickyContainer.style.left = `${sidebarContainerRect.left}px`;
        this.elements.stickyContainer.style.width = `${sidebarContainerRect.width}px`;
    }
    stateAfterContainerDesktop() {
        if (!this.elements.stickyContainer)
            return;
        this.elements.stickyContainer.style.position = 'absolute';
        const offset = this.containerBottomDistance - this.elements.stickyContainer.offsetHeight;
        this.elements.stickyContainer.style.top = `${offset}px`;
    }
    recalculateContainerBoundsDesktop() {
        if (!this.elements.sidebarContainer)
            return;
        const { top, bottom } = this.elements.sidebarContainer.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        this.containerTopDistance = top + scrollTop;
        this.containerBottomDistance = bottom + scrollTop;
    }
    /////////////////////
    // MOBILE UPDATE STICKY STATE
    updateStickyPositionMobile() {
        const topDistance = this.getTopDistance();
        if (topDistance < this.containerTopDistance) {
            if (this.currentState !== this.STATE_OPTIONS.BEFORE) {
                this.currentState = this.STATE_OPTIONS.BEFORE;
                return;
            }
            this.unreserveSpaceMobileMenuToggler();
            return;
        }
        if (topDistance > this.containerTopDistance && topDistance < this.containerBottomDistance) {
            if (this.currentState !== this.STATE_OPTIONS.INSIDE) {
                this.currentState = this.STATE_OPTIONS.INSIDE;
                return;
            }
            this.reserveSpaceMobileMenuToggler();
            this.stateInsideContainerMobile();
            return;
        }
        if (topDistance > this.containerBottomDistance) {
            if (this.currentState !== this.STATE_OPTIONS.AFTER) {
                this.currentState = this.STATE_OPTIONS.AFTER;
                return;
            }
            this.stateAfterContainerMobile();
            return;
        }
    }
    stateInsideContainerMobile() {
        if (!this.elements.navigationRoot)
            return;
        this.elements.navigationRoot.style.position = 'fixed';
        this.elements.navigationRoot.style.left = '0';
        this.elements.navigationRoot.style.right = '0';
        this.elements.navigationRoot.style.zIndex = '10';
        this.elements.navigationRoot.style.top = `${this.extraTopDistance}px`;
    }
    stateAfterContainerMobile() {
        if (!this.elements.navigationRoot)
            return;
        this.elements.navigationRoot.style.position = 'absolute';
        this.elements.navigationRoot.style.left = '0';
        this.elements.navigationRoot.style.right = '0';
        this.elements.navigationRoot.style.zIndex = '10';
        const offset = this.containerBottomDistance - this.containerTopDistance - this.elements.navigationRoot.offsetHeight;
        this.elements.navigationRoot.style.top = `${offset}px`;
    }
    recalculateContainerBoundsMobile() {
        if (!this.elements.toggler || !this.elements.root)
            return;
        const { top } = this.elements.toggler.getBoundingClientRect();
        const { bottom } = this.elements.root.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        this.containerTopDistance = top + scrollTop;
        this.containerBottomDistance = bottom + scrollTop;
    }
    /////////////////////
    // DESKTOP SIDEBAR
    recalculateSidebarPositionOnDesktop() {
        if (!this.elements.stickyContainer || !this.elements.navigationRoot)
            return;
        if (this.currentState !== this.STATE_OPTIONS.INSIDE)
            return;
        this.elements.stickyContainer.style.top = `${this.extraTopDistance}px`;
        this.setNavigationRootMaxHeightDesktop();
        const screenHeight = this.getScreenHeight();
        const stickyContainerHeight = this.elements.stickyContainer.scrollHeight + this.totalMaringsInSidebar;
        if (screenHeight < stickyContainerHeight) {
            const navHeight = this.elements.navigationRoot.scrollHeight;
            const maxHeight = screenHeight - (stickyContainerHeight - navHeight);
            this.setNavigationRootMaxHeightDesktop(maxHeight);
        }
    }
    setSidebarNavigationDynamicHeightDesktop() {
        if (!this.elements.stickyContainerInner || !this.elements.stickyContainer || !this.elements.navigationRoot)
            return;
        const screenHeight = this.getScreenHeight();
        const totalMaringsInSidebar = getTotalMarginsForChildren(this.elements.stickyContainerInner);
        const stickyContainerHeight = this.elements.stickyContainer.scrollHeight + totalMaringsInSidebar;
        if (screenHeight < stickyContainerHeight) {
            const navHeight = this.elements.navigationRoot.scrollHeight;
            const maxHeight = screenHeight - (stickyContainerHeight - navHeight);
            this.setNavigationRootMaxHeightDesktop(maxHeight);
        }
        else {
            this.setNavigationRootMaxHeightDesktop();
        }
        this.totalMaringsInSidebar = totalMaringsInSidebar;
    }
    /////////////////////
    // MOBILE MENU TOGGLER
    generateMobileMenuToggler() {
        if (!this.elements.navigationRoot)
            return;
        const button = this.getGeneratedMobileMenuToggler();
        if (!button)
            return;
        button.addEventListener('click', () => this.mobileMenuTogglerEventClick());
        // The layout owns the mobile toggler: a toggler rendered earlier inside the navigation is
        // replaced, so there is only one.
        this.elements.navigationRoot
            .querySelectorAll(`.${this.classNames.toggler}`)
            .forEach((existing) => existing.remove());
        this.elements.navigationRoot.prepend(button);
        this.elements.toggler = button;
    }
    mobileMenuTogglerEventClick() {
        const listEl = this.elements.navigationListContainer;
        if (!listEl)
            return;
        this.toggleNavigationContent(!listEl.classList.contains(this.classNames.togglerActive));
    }
    getGeneratedMobileMenuToggler() {
        if (!this.navigationLinksElements)
            return null;
        const button = document.createElement('button');
        const togglerText = document.createElement('span');
        togglerText.classList.add(this.classNames.togglerText);
        togglerText.innerText = this.navigationLinksElements[0].innerText;
        button.classList.add(this.classNames.toggler);
        button.appendChild(togglerText);
        return button;
    }
    reserveSpaceMobileMenuToggler() {
        if (!this.elements.toggler || !this.elements.navigationRoot)
            return;
        if (this.isReservedSpace)
            return;
        const extraSpaceDiv = document.createElement('div');
        extraSpaceDiv.classList.add(this.classNames.reserveSpace);
        extraSpaceDiv.style.paddingTop = `${this.elements.toggler.clientHeight}px`;
        this.elements.navigationRoot.before(extraSpaceDiv);
        this.isReservedSpace = true;
    }
    unreserveSpaceMobileMenuToggler() {
        if (!this.elements.navigationRoot)
            return;
        const prevEl = this.elements.navigationRoot.previousElementSibling;
        if (!prevEl)
            return;
        if (!prevEl.classList.contains(this.classNames.reserveSpace))
            return;
        this.elements.navigationRoot.style.position = '';
        this.elements.navigationRoot.style.top = '';
        this.elements.navigationRoot.style.left = '';
        this.elements.navigationRoot.style.right = '';
        this.elements.navigationRoot.style.zIndex = '';
        this.isReservedSpace = false;
        prevEl.remove();
    }
    /////////////////////
    // UTILITIES
    getScreenHeight() {
        return window.innerHeight - this.extraTopDistance;
    }
    getTopDistance() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        return scrollTop + this.extraTopDistance;
    }
    setNavigationRootMaxHeightDesktop(maxHeight) {
        if (!this.elements.navigationRoot)
            return;
        if (maxHeight) {
            this.elements.navigationRoot.style.maxHeight = `${maxHeight}px`;
            this.elements.navigationRoot.style.overflowY = 'scroll';
            return;
        }
        this.elements.navigationRoot.style.maxHeight = '';
        this.elements.navigationRoot.style.overflowY = '';
    }
    toggleNavigationContent(type) {
        if (!this.elements.toggler || !this.elements.navigationListContainer)
            return;
        if (type) {
            this.elements.toggler.classList.add(this.classNames.togglerActive);
            this.elements.navigationListContainer.classList.add(this.classNames.togglerActive);
            return;
        }
        this.elements.toggler.classList.remove(this.classNames.togglerActive);
        this.elements.navigationListContainer.classList.remove(this.classNames.togglerActive);
    }
}
