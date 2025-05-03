import Link from 'next/link';
import NavLinks from '@/app/ui/navbar/nav-links';

export default function Navbar() {
  return (
    <div className="flex flex-row w-full h-[55px] bg-gray-50 ">
      <Link
        className="flex h-auto items-center bg-gray-500"
        href="/"
      >
        <div className="w-40 pr-2 text-right text-white text-xl">
          <p>OSRS tools</p>
        </div>
      </Link>

      <div className="flex grow flex-row md:flex-row">
        <NavLinks />
      </div>
    </div>
  );
}
