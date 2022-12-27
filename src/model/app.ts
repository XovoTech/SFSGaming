import { IconTypes, ToastTypes } from "../constants/enums";

export interface IToast {
    text: string,
    title: string,
    type?: ToastTypes,
    icon?: string | null,
    iconType?: IconTypes,
}

export interface IRouteInstance {
    link: string;
    title: string;
    iconName: IconTypes;
    menu: boolean;
}

export interface INavItem {
    id: number | string;
    key: string,
    label: string,
    icons: Array<string>,
    iconType?: IconTypes,
}

export interface IDrawerItem {
    key: string;
    label: string;
    iconType: IconTypes;
    icons: string[];
}

export interface IMeta {
    current_page: number;
    last_page: number;
}

export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;