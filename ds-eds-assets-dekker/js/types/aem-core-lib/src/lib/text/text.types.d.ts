export interface TextProps {
    id: string;
    text: string;
    className?: string;
    icon?: IconTextType;
}
export type IconsText = 'call' | 'contact_mail' | 'email' | 'account' | 'language' | 'arrow-left' | 'arrow-right' | 'pin-drop' | '3d-rotation' | 'alarm';
export type IconTextType = IconsText | string;
