import CraftingTable from "@/app/ui/skills/tables/crafting-table";
import UserSearch from "@/app/ui/user-search/user-search";
import CraftingTableSkeleton from "@/app/ui/skeletons/crafting-table-skeleton";
import {Suspense} from "react";


export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex flex-row items-center gap-2 ">
                <img
                 src="/icons/Crafting_icon.png"
                 alt={"tables icon"}
                />
                <h2 className="text-3xl font-bold">
                    Crafting
                </h2>

            </div>

            <UserSearch skill='Crafting'/>
        </div>

    );
}