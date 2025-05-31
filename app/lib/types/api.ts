export interface TimingInfo {
    total_time: number;
    api_call_time: number;
    processing_time: number;
    function_name: string;
    items_processed?: number;
    individual_times?: number[];
}

export interface SimpleResponse {
    cost: number | null;
    price: number | null;
    profit: number | null;
    profit_hr: number | null;
    ingredients_cost: number | null;
    ingredients_data: Record<string, any> | null;
    full_item_cost: number | null;
    timing?: TimingInfo;
}

export interface BatchResponse {
    results: Record<string, SimpleResponse | null>;
    timing: TimingInfo;
    errors: Record<string, string>;
}

export interface MarketServiceResponse {
    live: {
        high: number;
        low: number;
        highTime: number;
        lowTime: number;
    };
    details: {
        name: string;
        [key: string]: any; // For other properties in details
    };
    db: {
        id: string;
        highalch?: number;
        lowalch?: number;
        buylimit?: number;
        [key: string]: any; // For other properties in db
    };
    error?: string;
}
