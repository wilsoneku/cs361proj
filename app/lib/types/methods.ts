export interface CraftingItem {
    id: number;
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    ingredients: Record<string, any>;
    xpNeeded?: number;
}

export interface IngredientsData {
    name: string;
    avg_cost: number;
    high_cost: number;
    low_cost: number;
    quantity: number;
    total_cost: number;
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

export interface TimingInfo {
    total_time: number;
    api_call_time: number;
    processing_time: number;
    function_name: string;
}

