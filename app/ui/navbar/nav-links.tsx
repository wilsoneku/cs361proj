import {
  CalculatorIcon,
  BookOpenIcon,
  CircleStackIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Market', href: '/market', icon: CircleStackIcon },
  { name: 'Skills', href: '/skills', icon: BookOpenIcon },
  { name: 'Calculators', href: '/calculators', icon: CalculatorIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex  items-center justify-center gap-2  p-3 text-sm font-medium hover:bg-gray-300 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
