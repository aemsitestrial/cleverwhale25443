import { HTMLAttributeAnchorTarget } from '../../../../dom-types';
import { IDataLayer, ILink } from '../../interfaces/common';
import { IdentificatorType, AlignType, LineClamp, VideoType, GlobalImageProps } from '../../types/common';
import { ImageProps } from '../image/image.types';
type TeaserAction = Pick<TeaserProps, 'id' | 'link' | 'title' | 'dataLayer' | ':type'> & {
    target?: HTMLAttributeAnchorTarget;
};
export interface TeaserProps extends GlobalImageProps {
    id: IdentificatorType;
    title?: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    pretitle?: string;
    description?: string;
    date?: string;
    alignContent?: AlignType;
    lineClamp?: LineClamp;
    className?: string;
    actionsEnabled: boolean;
    imageLinkHidden: boolean;
    titleLinkHidden: boolean;
    link?: ILink;
    imagePath?: string;
    image?: ImageProps;
    dataLayer?: IDataLayer | any;
    ':type'?: string;
    /**
     * TeaserProps is shared by every Teaser-family consumer (banner, text, the standalone
     * teaser block, ACG's teaser family), so it carries only fields that apply to all of them.
     * Card-only fields live in card-content.type.ts.
     */
    actions?: TeaserAction[] | [];
    styles?: object;
    video?: TeaserVideoType;
    useJsModal?: boolean;
}
type TeaserVideoType = {
    id: IdentificatorType;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
    autoPlay?: boolean;
    width?: number;
    height?: number;
    playsInline?: boolean;
    poster?: string;
    source?: VideoType[];
};
export {};
