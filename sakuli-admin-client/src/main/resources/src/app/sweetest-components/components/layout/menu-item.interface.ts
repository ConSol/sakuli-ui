import {FontawesomeIcon} from '../presentation/icon/fontawesome-icon.utils';
export interface MenuItem {
  icon: FontawesomeIcon,
  label: string,
  link: string | string[],
  children?: MenuItem[]
}
