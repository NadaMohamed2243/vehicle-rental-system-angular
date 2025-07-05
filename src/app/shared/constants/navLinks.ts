interface NavLink {
  img: string;
  route: string;
}

export const links: NavLink[] = [
  {
    img: 'home',
    route: '/home',
  },
  {
    img: 'car',
    route: '/cars',
  },
  {
    img: 'calendar',
    route: '/calendar',
  },
  {
    img: 'heart',
    route: '/wishlist',
  },
  {
    img: 'history',
    route: '/history',
  },
  {
    img: 'user',
    route: '/profile',
  },
];
