interface NavLink {
  img: string;
  route: string;
  label: string; // translation key
}

export const links: NavLink[] = [
  {
    img: 'home',
    route: '/home',
    label: 'SIDEBAR.HOME',
  },
  {
    img: 'car',
    route: '/cars',
    label: 'SIDEBAR.CARS',
  },
  {
    img: 'heart',
    route: '/favourites',
    label: 'SIDEBAR.FAVOURITES',
  },
  {
    img: 'history',
    route: '/history',
    label: 'SIDEBAR.HISTORY',
  },
  {
    img: 'user',
    route: '/profile',
    label: 'SIDEBAR.PROFILE',
  },
];
