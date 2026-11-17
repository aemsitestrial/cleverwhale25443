import { IdentificatorType, VideoType } from '../../types/common';
export type EmbedVideoProps = {
    id: IdentificatorType;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
    autoPlay?: boolean;
    width?: number;
    height?: number;
    poster?: string;
    playsInline?: boolean;
    source?: VideoType[];
    videoImageFallback?: string;
    className?: string;
};
