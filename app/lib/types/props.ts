import {ItemInfo} from "@/app/lib/types/methods";

export interface SkillInfo {
    level: number;
    xp: number;
}

export interface UserSearchProps {
    skill: string;
    onDataUpdate: (data: [string | null, string | null, SkillInfo | null] | null) => void;
}

export interface DisplayXpProps {
    data: [string | null, string | null, SkillInfo | null] | null;
    onXpUpdate: (xp: number) => void;
}

export interface CraftingTableProps {
    xpNeeded?: number | undefined;
}

export interface MarketSearchProps {
    onItemSelected: (itemId: string | null) => void;
    isLoading: boolean;
}

export interface ItemDisplayProps {
    itemInfo: ItemInfo | null;
    isLoading: boolean;
}