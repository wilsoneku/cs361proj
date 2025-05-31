'use client'
import {useState} from "react";

import UserSearch from "@/app/ui/user-search/user-search";
import DisplayXp from "@/app/ui/user-search/display-xp";

export interface SkillInfo {
    level: number;
    xp: number;
}

export default function Page() {
    const [xpNeeded, setXpNeeded] = useState<number>();
    const [searchData, setSearchData] = useState<[string | null, string | null, SkillInfo | null] | null>(null);

    const handleXpUpdate = (xp: number) => {
        setXpNeeded(xp);
    };

    return (
        <div className="flex flex-col items-center justify-center mt-4">
            <div className="flex flex-row items-center gap-2 ">
                <img
                    src="/icons/Prayer_icon.png"
                    alt={"tables icon"}
                />
                <h2 className="text-3xl font-bold">
                    Prayer
                </h2>

            </div>

            <UserSearch
                skill='Prayer'
                onDataUpdate={setSearchData}
            />
            <DisplayXp
                data={searchData}
                onXpUpdate={handleXpUpdate}
            />

        </div>

    );
}