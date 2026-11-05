import { ButtonEventTypes, ButtonRefType } from '../../genericInterfaces/events';
import { IdentificatorType, TextTransformType } from '../../types/common';
import { ILink, IDataLayer } from '../../interfaces/common';
export declare enum EnumsIcon {
    ArrowRight = "arrow-right",
    ChenvronDown = "chenvron-down",
    ChevronRight = "chevron-right",
    ChevronUp = "chevron-up",
    Close = "close",
    Email = "email",
    Minus = "minus",
    Pause = "pause",
    Phone = "phone",
    Play = "play",
    Warning = "warning",
    ChevronLeft = "chevron-left",
    Pluss = "pluss",
    External = "external",
    ChevronDown = "chevron-down",
    Contact = "contact",
    Launch = "launch",
    Download = "download",
    Planet = "planet"
}
export type ButtonType = 'primary' | 'secondary' | 'tetriary';
type ButtonColorType = 'primary' | 'secondary';
export type EnumAEMclassName = 'button' | 'text-uppercase' | 'text-capitalize' | 'cmp-button--primary' | 'cmp-button--secondary';
export type ButtonLinkTargetType = '_blank' | '_self' | '_parent' | '_top';
export interface ButtonProps extends ButtonEventTypes {
    id: IdentificatorType;
    text: string;
    className?: string;
    AEMclassNameSlot1?: EnumAEMclassName;
    AEMclassNameSlot2?: EnumAEMclassName;
    AEMclassNameSlot3?: EnumAEMclassName;
    typeTransform?: TextTransformType;
    type?: ButtonType;
    disabled?: boolean;
    colorType?: ButtonColorType;
    icon?: EnumsIcon | string;
    target?: ButtonLinkTargetType;
    dataLayer?: IDataLayer | unknown;
    ':type'?: string;
    buttonLink?: ILink;
    customRef?: ButtonRefType;
    useRootClassName?: boolean;
}
export {};
