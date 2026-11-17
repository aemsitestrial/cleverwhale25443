// Stand-ins for the React types the design system's props mention.
export type ReactNode = Node | string | number | boolean | null | undefined | ReactNode[];
export type HTMLAttributeAnchorTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});
export type ImageFetchPriority = 'high' | 'low' | 'auto';
export type ForwardedRef<T> = ((instance: T | null) => void) | { current: T | null } | null;
export type MouseEvent<T = Element, E = globalThis.MouseEvent> = E & { currentTarget: T };
export type EventHandler<T, E> = (event: E & { currentTarget: T }) => void;
export interface DOMAttributes<T> {
  onClick?: EventHandler<T, globalThis.MouseEvent>;
  onFocus?: EventHandler<T, FocusEvent>;
  onBlur?: EventHandler<T, FocusEvent>;
  onChange?: EventHandler<T, Event>;
  onInput?: EventHandler<T, Event>;
  onKeyDown?: EventHandler<T, KeyboardEvent>;
  onKeyUp?: EventHandler<T, KeyboardEvent>;
}
export interface HTMLAttributes<T> extends DOMAttributes<T> {
  id?: string;
  className?: string;
  title?: string;
  role?: string;
  tabIndex?: number;
  hidden?: boolean;
  lang?: string;
  style?: string;
}
export interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
  alt?: string;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'auto' | 'sync';
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  referrerPolicy?: string;
}
