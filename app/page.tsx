import {HomeButtons} from "@/app/ui/home/home-buttons";
import SearchBar from "@/app/ui/home/search-bar";


export default function Page() {
  return (
    <main className="flex flex-col p-4 min-w-fit min-h-fit">

      <div className="flex flex-col w-full text-center gap-2.5 items-center">

        {/*TITLE / INFO TEXT*/}
        <div className="flex flex-col gap-4">
          <div className={'${osrsFont.className} text-4xl font-bold'}>
            OSRS Tools
          </div>
          <div className="text-xl">
            A collection of tools for OSRS
          </div>
          <div className="text-l w-[500px]">
            Discover efficient and profitable skilling methods, complete with real-time Grand Exchange prices,
            to level up your gameplay
          </div>
        </div>

        <SearchBar />

        <HomeButtons />

      </div>
    </main>
  );
}
