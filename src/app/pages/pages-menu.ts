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
  },
  {
    title: 'Buscar',
    icon: 'nb-search',
    link: '/pages/user-search',
  },
  {
    title: 'Dashboard',
    icon: 'nb-bar-chart',
    link: '/pages/charts/echarts',
  },
  {
    title: 'Acerca',
    icon: 'nb-flame-circled',
    link: '/pages/about'
  },
  {
    title: 'Cerrar Sesion',
    icon: 'nb-close',
    link: '/auth/logout',
  },

];
