import { IdentificatorType } from '../../types/common';
export type EmbedVideoIframeProps = {
    id: IdentificatorType;
    width?: string;
    height?: string;
    src: string;
    allow?: string;
    className?: string;
    ariaLabel?: string;
    title?: string;
    frameBorder?: string;
};
