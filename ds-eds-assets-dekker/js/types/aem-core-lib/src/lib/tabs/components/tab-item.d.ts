import { ReactNode } from '../../../../../dom-types';
type TabItemProps = {
    id: string;
    ariaLabelledBy: string;
    tabIndex: number;
    isActive: boolean;
    children: ReactNode;
};
declare function TabItem({ id, ariaLabelledBy, tabIndex, isActive, children }: TabItemProps): HTMLElement;
export default TabItem;
