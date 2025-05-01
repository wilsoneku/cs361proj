import CraftingTable from "@/app/ui/skills/crafting/crafting-table";

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center w-full gap-8">
            Crafting
            <CraftingTable />
        </div>

    );
}