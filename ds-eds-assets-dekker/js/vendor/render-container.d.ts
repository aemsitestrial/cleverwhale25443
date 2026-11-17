/** @param {number | string} [grid] */
export function gridClassName(grid?: number | string): string;
/** @param {string} [gridClass] */
export function gridCountOf(gridClass?: string): string | number;
/**
 * The props of ContainerLayout that this builder takes.
 *
 * @typedef {object} ContainerProps
 * @property {string} [id]
 * @property {string} [className]
 * @property {boolean} [useLibClass]
 * @property {boolean} [centered]
 * @property {boolean} [fullWidth]
 * @property {number | string} [contentWidth] 1 to 12
 * @property {string} [bgColor]
 * @property {string} [bgImage] a CSS value, for example url("...")
 * @property {number | string} [grid] 1 to 5, '1-2' or '2-1'
 * @property {boolean} [useAemGridTemplate]
 */
/**
 * @param {ContainerProps} [props]
 * @param {HTMLElement} [root]
 * @returns {{ root: HTMLElement, container: HTMLElement, content: HTMLElement }}
 */
export default function renderContainer({ id, className, useLibClass, centered, fullWidth, contentWidth, bgColor, bgImage, grid, useAemGridTemplate, }?: ContainerProps, root?: HTMLElement): {
    root: HTMLElement;
    container: HTMLElement;
    content: HTMLElement;
};
/**
 * The props of ContainerLayout that this builder takes.
 */
export type ContainerProps = {
    id?: string;
    className?: string;
    useLibClass?: boolean;
    centered?: boolean;
    fullWidth?: boolean;
    /**
     * 1 to 12
     */
    contentWidth?: number | string;
    bgColor?: string;
    /**
     * a CSS value, for example url("...")
     */
    bgImage?: string;
    /**
     * 1 to 5, '1-2' or '2-1'
     */
    grid?: number | string;
    useAemGridTemplate?: boolean;
};
