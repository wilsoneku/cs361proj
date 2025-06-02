import {TimingInfo} from "@/app/lib/types/api";

export interface CraftingItem {
    id: number;
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    ingredients: Record<string, any>;
    xpNeeded?: number;
}

export interface ItemData {
    id: number;
    highalch: number;
    lowalch: number;
    buylimit: number;
}

export interface ItemInfo {
    itemid: number,
    high: number,
    highTime: number,
    low: number,
    lowTime: number
    average: number,
    details: Record<string, any>,
    highalch?: number,
    lowalch?: number,
    buylimit?: number
}

export type crafting_methods = {
    id: number
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    ingredients: Record<string, any>;
};

export type SearchData = {
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
    timing?: TimingInfo;
};

export interface TimeAgoOptions {
    includeSeconds?: boolean;
    shortFormat?: boolean;
}
