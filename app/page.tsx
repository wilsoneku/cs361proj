import {HomeButtons} from "@/app/ui/home/home-buttons";
import SearchBar from "@/app/ui/home/search-bar";


export default function Page() {
  return (
    <main className="flex flex-col p-4 min-w-fit min-h-fit">
      <div className="flex flex-col w-full text-center items-center">
        {/*TITLE / INFO TEXT*/}
        <div className="flex flex-col gap-4">
          <h1 className={'text-4xl font-bold'}>
            OSRS Tools
          </h1>
          <h2 className="text-xl">
            A collection of tools for OSRS
          </h2>
          <h3 className="text-l w-[500px]">
            Discover efficient and profitable skilling methods, complete with real-time Grand Exchange prices,
            to level up your gameplay
          </h3>
        </div>
      </div>

      <div className="mt-36">
        {/*<SearchBar />*/}
        <HomeButtons />
      </div>

    </main>
  );
}
