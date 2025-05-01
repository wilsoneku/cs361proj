import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">

      <div className="flex flex-col">
        {/*TITLE / INFO TEXT*/}
        <div className="w-full text-center text-4xl font-bold my-1">
          OSRS Tools
        </div>
        <div className="w-full text-center text-xl my-1">
          A collection of tools for OSRS
        </div>
        <div className="w-full justify-center text-center text-l px-56 my-1">
          Discover efficient and profitable skilling methods, complete with real-time Grand Exchange prices,
          to level up your gameplay
        </div>

        <div className="flex justify-center my-12 ">
          {/*SEARCH BAR*/}
          <input
              className="mx-52 w-full rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="text"
              placeholder="Search in the Grand Exchange..."
          />
        </div>

        <div className="flex justify-center gap-24 my-8">
          {/*MAIN BUTTONS*/}
          <Link
              href="/market">
            <Image
                src="/button-1.png"
                width={200}
                height={200}
                className="hidden md:block"
                alt="background image for navigation button"/>
          </Link>
          <Link href="/skills">
            <Image
                src="/button-1.png"
                width={200}
                height={200}
                className="hidden md:block"
                alt="background image for navigation button"/>
          </Link>
          <Link href="/skills">
            <Image
                src="/button-1.png"
                width={200}
                height={200}
                className="hidden md:block"
                alt="background image for navigation button"/>
          </Link>
        </div>
      </div>
    </main>
  );
}
