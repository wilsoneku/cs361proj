'use client'

import Form from "next/form";
import React, {useState, useEffect} from "react";

interface skillInfo {
    level: number;
    xp: number;
}

interface DisplayXpProps {
    data: [string | null, string | null, skillInfo | null] | null;
}

// const xpTable = [{ level: 1, xp: 0 }, { level: 2, xp: 83 }, { level: 3, xp: 174 }, { level: 4, xp: 276 }, { level: 5, xp: 388 },
//     { level: 6, xp: 512 }, { level: 7, xp: 650 }, { level: 8, xp: 801 }, { level: 9, xp: 969 }, { level: 10, xp: 1154 },
//     { level: 11, xp: 1358 }, { level: 12, xp: 1584 }, { level: 13, xp: 1833 }, { level: 14, xp: 2107 }, { level: 15, xp: 2411 },
//     { level: 16, xp: 2746 }, { level: 17, xp: 3115 }, { level: 18, xp: 3523 }, { level: 19, xp: 3973 }, { level: 20, xp: 4470 },
//     { level: 21, xp: 5018 }, { level: 22, xp: 5624 }, { level: 23, xp: 6291 }, { level: 24, xp: 7028 }, { level: 25, xp: 7842 },
//     { level: 26, xp: 8740 }, { level: 27, xp: 9730 }, { level: 28, xp: 10824 }, { level: 29, xp: 12031 }, { level: 30, xp: 13363 },
//     { level: 31, xp: 14833 }, { level: 32, xp: 16456 }, { level: 33, xp: 18247 }, { level: 34, xp: 20224 }, { level: 35, xp: 22406 },
//     { level: 36, xp: 24815 }, { level: 37, xp: 27473 }, { level: 38, xp: 30408 }, { level: 39, xp: 33648 }, { level: 40, xp: 37224 },
//     { level: 41, xp: 41171 }, { level: 42, xp: 45529 }, { level: 43, xp: 50339 }, { level: 44, xp: 55649 }, { level: 45, xp: 61512 },
//     { level: 46, xp: 67983 }, { level: 47, xp: 75127 }, { level: 48, xp: 83014 }, { level: 49, xp: 91721 }, { level: 50, xp: 101333 },
//     { level: 51, xp: 111945 }, { level: 52, xp: 123660 }, { level: 53, xp: 136594 }, { level: 54, xp: 150872 }, { level: 55, xp: 166636 },
//     { level: 56, xp: 184040 }, { level: 57, xp: 203254 }, { level: 58, xp: 224466 }, { level: 59, xp: 247886 }, { level: 60, xp: 273742 },
//     { level: 61, xp: 302288 }, { level: 62, xp: 333804 }, { level: 63, xp: 368599 }, { level: 64, xp: 407015 }, { level: 65, xp: 449428 },
//     { level: 66, xp: 496254 }, { level: 67, xp: 547953 }, { level: 68, xp: 605032 }, { level: 69, xp: 668051 }, { level: 70, xp: 737627 },
//     { level: 71, xp: 814445 }, { level: 72, xp: 899257 }, { level: 73, xp: 992895 }, { level: 74, xp: 1096278 }, { level: 75, xp: 1210421 },
//     { level: 76, xp: 1336443 }, { level: 77, xp: 1475581 }, { level: 78, xp: 1629200 }, { level: 79, xp: 1798808 }, { level: 80, xp: 1986068 },
//     { level: 81, xp: 2192818 }, { level: 82, xp: 2421087 }, { level: 83, xp: 2673114 }, { level: 84, xp: 2951373 }, { level: 85, xp: 3258594 },
//     { level: 86, xp: 3597792 }, { level: 87, xp: 3972294 }, { level: 88, xp: 4385776 }, { level: 89, xp: 4842295 }, { level: 90, xp: 5346332 },
//     { level: 91, xp: 5902831 }, { level: 92, xp: 6517253 }, { level: 93, xp: 7195629 }, { level: 94, xp: 7944614 }, { level: 95, xp: 8771558 },
//     { level: 96, xp: 9684577 }, { level: 97, xp: 10692629 }, { level: 98, xp: 11805606 }, { level: 99, xp: 13034431 }
// ]

const xpTable = [
    0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107, 2411, 2746, 3115, 3523,
    3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730, 10824, 12031, 13363, 14833, 16456, 18247,
    20224, 22406, 24815, 27473, 30408, 33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127,
    83014, 91721, 101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886, 273742,
    302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051, 737627, 814445, 899257,
    992895, 1096278, 1210421, 1336443, 1475581, 1629200, 1798808, 1986068, 2192818, 2421087, 2673114,
    2951373, 3258594, 3597792, 3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614,
    8771558, 9684577, 10692629, 11805606, 13034431
];


// export default function DisplayXp({data}:DisplayXpProps) {
//     const [username, returnedSkill, skillInfo] = data ?? [null, null, null];
//
//     return (
//         <div className="flex flex-row w-fit border-2 items-end border-gray-300 rounded-md p-2 gap-2">
//             <div className="flex flex-col items-end">
//                 <SkillLevel label="Target Level"/>
//                 <SkillLevel label="Current Level"/>
//             </div>
//             <div className="flex flex-row gap-2 justify-center">
//                 {/*Form Results*/}
//                 {username &&    <p><strong>Rsn:</strong> {username}</p>}
//                 {returnedSkill &&       <p><strong>Skill:</strong>  {returnedSkill}</p>}
//             </div>
//         </div>
//     );
// }

export default function DisplayXp({data}: DisplayXpProps) {
    const [username, returnedSkill, skillInfo] = data ?? [null, null, null];
    const [currentLevel, setCurrentLevel] = useState('');
    const [targetLevel, setTargetLevel] = useState('');

    // Update current level when API data is available
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
    const currentXp = skillInfo?.xp ?? 0;
    const targetLevelNum = parseInt(targetLevel || '0');

    const calculateXpDifference = () => {
        if (!targetLevel || targetLevelNum <= currentLevelNum) return null;
        const targetXp = xpTable[targetLevelNum - 1] * 1000;
        const xpNeeded = targetXp - currentXp;
        return xpNeeded > 0 ? xpNeeded : 0;
    };

    const xpDifference = calculateXpDifference();

    return (
        <div className="flex flex-col gap-2 items-center mt-4">
            {username && <p><strong>Rsn:</strong> {username}</p>}
            {returnedSkill && <p><strong>Skill:</strong> {returnedSkill}</p>}

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

                {skillInfo && (
                    <p><strong>Current Xp:</strong> {skillInfo.xp.toLocaleString()}</p>
                )}

                {xpDifference !== null && targetLevelNum > currentLevelNum && (
                    <p><strong>Xp Needed:</strong> {xpDifference.toLocaleString()}</p>
                )}
            </div>
        </div>
    );
}



// function SkillLevel({ label }: { label: string }) {
//     const [selected, setSelected] = useState('');
//     const levelObj = xpTable.find(obj => obj.level === Number(selected));
//
//     return (
//         <div className="flex flex-row items-center gap-4">
//             <label htmlFor="level-dropdown" className="font-semibold">
//                 {label}
//             </label>
//             <input
//                 list="levels"
//                 id="level-dropdown"
//                 className="border rounded px-3 py-2"
//                 placeholder="Lvl"
//                 value={selected}
//                 onChange={e =>
//                     setSelected(e.target.value.replace(/[^0-9]/g, ''))}
//                 pattern="^(?:[1-9][0-9]?|99)$"
//                 size={2}
//                 maxLength={2}
//                 min={1}
//                 max={99}
//                 inputMode="numeric"
//                 autoComplete="off"
//             />
//             <datalist id="levels">
//                 {xpTable.map(({ level }) => (
//                     <option key={level} value={level} />
//                 ))}
//             </datalist>
//
//             {levelObj && (
//                 <span className="font-mono">
//                     {/*Level {levelObj.level} requires */}
//                     <strong>{levelObj.xp.toLocaleString()}</strong> XP
//                   </span>
//             )}
//         </div>
//     );
// }
