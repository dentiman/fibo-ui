import {TemplateRef} from '@angular/core';

export type MenuItemType = {
  label: string;
  url?: string;
  icon?: any;
  badge?: string | number;
  children?: MenuItemType[];
  disabled?: boolean;
  content?: TemplateRef<any>;
  callback?: () => void;
  value?: any;
}
