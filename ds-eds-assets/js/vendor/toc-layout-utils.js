export function getTotalMarginsForChildren(parent) {
    let total = 0;
    for (const child of Array.from(parent.children)) {
        const styles = getComputedStyle(child);
        const marginTop = parseFloat(styles.marginTop);
        const marginBottom = parseFloat(styles.marginBottom);
        total += marginTop + marginBottom;
    }
    return total;
}
export function isVisibleElInContainer(container, element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    return elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom;
}
export function scrollIntoView(container, element) {
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const isVisible = isVisibleElInContainer(container, element);
    if (isVisible)
        return;
    // el above visible area
    if (elementRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - elementRect.top;
    }
    // el below visible area
    if (elementRect.bottom > containerRect.bottom) {
        container.scrollTop += elementRect.bottom - containerRect.bottom;
    }
}
export function getElementById(listElements, id) {
    const el = Array.from(listElements).find((link) => {
        const href = link.getAttribute('href');
        return href?.slice(1) === id;
    });
    return el ?? null;
}
export function getElementIndexById(listElements, id) {
    return listElements.findIndex((heading) => heading.getAttribute('id') === id);
}
