export interface HeaderItem {
  id: string;
  label: React.ReactNode;
  href: string;
  onClick?: () => void;
}

export const headerItems: HeaderItem[] = [
  {
    id: 'home',
    label: 'Problem 1',
    href: '/',
  },
  {
    id: 'swap',
    label: 'Problem 2',
    href: '/swap',
  },
  {
    id: 'messy-review',
    label: 'Problem 3',
    href: '/messy-review',
  },
];
