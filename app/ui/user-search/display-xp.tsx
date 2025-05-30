'use client'

import xpTable from "@/app/ui/user-search/xp-table";
import React, {useState, useEffect} from "react";
import CraftingTable from "@/app/ui/skills/crafting/crafting-table";

interface skillInfo {
    level: number;
    xp: number;
}

interface DisplayXpProps {
    data: [string | null, string | null, skillInfo | null] | null;
}

export default function DisplayXp({data}: DisplayXpProps) {
    const [username, returnedSkill, skillInfo] = data ?? [null, null, null];
    const [currentLevel, setCurrentLevel] = useState('');
    const [targetLevel, setTargetLevel] = useState('');
    const [xpNeeded, setXpNeeded] = useState<number | undefined>();
    const [resetKey, setResetKey] = useState(0);

    // Update currentLevel when microservice data is received
    useEffect(() => {
        if (skillInfo?.level) {
            setCurrentLevel(skillInfo.level.toString());
        }
    }, [skillInfo]);


    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && (value === '' || (parseInt(value) <= 99 && parseInt(value) > 0))) {
            setter(value);
        }
    };

    const currentLevelNum = parseInt(currentLevel || '0');
    const currentXp = xpTable.get(currentLevelNum) ?? 0;
    const targetLevelNum = parseInt(targetLevel || '0');
    const targetXp = xpTable.get(targetLevelNum) ?? 0;

    const xpDifference = targetXp - currentXp;

    return (
        <div className="flex flex-col gap-2 items-center mt-4">

            <div className="flex flex-row gap-2 items-center">
                {username && <p><strong>Rsn:</strong> {username}</p>}
            </div>

            <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="flex gap-2 items-center">
                        <strong>Current Lvl:</strong>
                        <input
                            type="text"
                            value={currentLevel}
                            onChange={(e) => handleLevelChange(e, setCurrentLevel)}
                            className="w-16 h-[35px] rounded-md border-gray-300 focus:ring-1 focus:ring-gray-800"
                            placeholder="1-99"
                        />
                    </div>

                    <div className="flex gap-2 items-center">
                        <strong>Target Lvl:</strong>
                        <input
                            type="text"
                            value={targetLevel}
                            onChange={(e) => handleLevelChange(e, setTargetLevel)}
                            className="w-16 h-[35px] rounded-md border-gray-300 focus:ring-1 focus:ring-gray-800"
                            placeholder="1-99"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 items-center">
                    <p><strong>Current Xp:</strong> {" "}
                        {skillInfo?.xp?.toLocaleString() || currentXp?.toLocaleString() || 0}
                    </p>
                    <p><strong>Target Xp:</strong> {" "}
                        {targetXp?.toLocaleString() || 0}
                    </p>


                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                {xpDifference !== null && targetLevelNum > currentLevelNum && (
                    <p><strong>Xp Needed:</strong> {xpDifference.toLocaleString()}</p>
                )}
            </div>
            <CraftingTable
                xpNeeded={xpDifference > 0 ? xpDifference : undefined}
            />
        </div>
    );
}