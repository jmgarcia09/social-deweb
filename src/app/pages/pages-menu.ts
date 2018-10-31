import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Red Social",
    group: true
  },
  {
    title: 'Perfil',
    icon: 'nb-person',
    link: '/pages/user-profile',
    home: true,
  },
  {
    title: 'Blog',
    icon: 'nb-list',
    link: '/pages/posts'
  },{
    title: 'Acerca',
    icon: 'nb-flame-circled',
    link: '/pages/about'
  },

  {
    title: 'IoT Dashboard',
    icon: 'nb-home',
    link: '/pages/iot-dashboard',
  },

];
