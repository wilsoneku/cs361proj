import Link from 'next/link';
import NavLinks from '@/app/ui/home/nav-links';

export default function Navbar() {
  return (
    <div className="flex w-full flex-row">
      <Link
        className="flex h-auto items-center bg-blue-600"
        href="/"
      >
        <div className="w-40 pr-2 text-right text-white text-xl">
          <p>OSRS tools</p>
        </div>
      </Link>

      <div className="flex grow flex-row md:flex-row">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {/*<form>*/}
        {/*  <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">*/}
        {/*    <PowerIcon className="w-6" />*/}
        {/*    <div className="hidden md:block">Sign Out</div>*/}
        {/*  </button>*/}
        {/*</form>*/}
      </div>
    </div>
  );
}
