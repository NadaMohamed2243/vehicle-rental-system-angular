interface NavLink {
  img: string;
  route: string;
  label: string; // Add label property
}

export const links: NavLink[] = [
  {
    img: 'home',
    route: '/home',
    label: 'Home',
  },
  {
    img: 'car',
    route: '/cars',
    label: 'Cars',
  },
  {
    img: 'heart',
    route: '/favourites',
    label: 'Favourites',
  },
  {
    img: 'history',
    route: '/history',
    label: 'History',
  },
  {
    img: 'user',
    route: '/profile',
    label: 'Profile',
  },
];
