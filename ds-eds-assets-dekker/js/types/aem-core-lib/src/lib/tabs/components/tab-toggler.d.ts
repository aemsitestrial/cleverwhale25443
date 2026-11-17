type TabTogglerProps = {
    id: string;
    isActive: boolean;
    text: string;
    ariaControl: string;
};
declare function TabToggler({ id, isActive, ariaControl, text }: TabTogglerProps): HTMLElement;
export default TabToggler;
