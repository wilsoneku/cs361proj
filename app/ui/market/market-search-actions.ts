'use server';

import {ItemInfo, SearchData, TimingInfo, MarketServiceResponse} from "@/app/lib/types";

async function getMarketData(itemid: string): Promise<{ data: MarketServiceResponse | null, timing: TimingInfo }> {
    const functionStart = performance.now();
    const url = 'http://localhost:8001/market-data/'
    const payload = {'itemid': itemid}
    console.log('🚀 getMarketData started for itemid:', itemid)

    try {
        const apiCallStart = performance.now();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();
        const apiCallEnd = performance.now();
        const apiCallTime = apiCallEnd - apiCallStart;

        // Time the JSON parsing
        const processingStart = performance.now();
        const data = JSON.parse(text) as MarketServiceResponse;
        const processingEnd = performance.now();
        const processingTime = processingEnd - processingStart;

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(apiCallTime * 100) / 100,
            processing_time: Math.round(processingTime * 100) / 100,
            function_name: 'getMarketData'
        };

        return { data, timing };

    } catch (error: any) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: 0,
            processing_time: 0,
            function_name: 'getMarketData_error'
        };
        console.error(`Market data fetch error after ${timing.total_time}ms:`, error.message);
        return { data: null, timing };
    }
}

function parseMarketData(data: MarketServiceResponse, itemID: string): ItemInfo | null {
    if (!data || data.error) {
        console.error('Error in market data:', data?.error || 'No data returned');
        return null;
    }

    // Extract data from the new structure
    const { live, details, db } = data;

    if (!live || !details || !db) {
        console.error('Missing required data in market response');
        return null;
    }

    // Convert string values to numbers if needed
    const highalch = typeof db.highalch === 'string' ? parseFloat(db.highalch) : (db.highalch || 0);
    const lowalch = typeof db.lowalch === 'string' ? parseFloat(db.lowalch) : (db.lowalch || 0);
    const buylimit = typeof db.buylimit === 'string' ? parseFloat(db.buylimit) : (db.buylimit || 0);

    // Create the ItemInfo object from the combined data
    return {
        itemid: parseInt(itemID),
        high: live.high,
        low: live.low,
        average: Math.ceil((live.high + live.low) / 2), // Calculate average if needed
        highTime: live.highTime,
        lowTime: live.lowTime,
        highalch,
        lowalch,
        buylimit,
        details: {
            item: {
                icon: details.icon,
                icon_large: details.icon_large,
                id: details.id,
                type: details.type,
                typeIcon: details.typeIcon,
                name: details.name,
                description: details.description,
                current: details.current,
                today: details.today,
                members: details.members,
                day30: details.day30,
                day90: details.day90,
                day180: details.day180
            }
        },
    };
}

export async function fetchItemID(prevState: SearchData, payload: FormData): Promise<{
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
    timing?: TimingInfo
}> {
    const functionStart = performance.now();

    const itemID = payload.get('itemID') as string;
    if (!itemID) {
        return {
            ...prevState,
            error: 'No item ID provided'
        };
    }

    try {
        // getData from API call
        const { data, timing: apiTiming } = await getMarketData(itemID);
        const fetchEnd = performance.now();
        const fetchTime = fetchEnd - functionStart;

        console.log(`📨 Received data for ${itemID} in ${Math.round(fetchTime * 100) / 100}ms`)

        if (!data) {
            return {
                itemID: itemID.toString(),
                info: null,
                error: "Failed to fetch market data",
            };
        }

        // repackage data
        const processingStart = performance.now();
        const itemInfo = parseMarketData(data, itemID);
        const processingEnd = performance.now();
        const localProcessingTime = processingEnd - processingStart;

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const overallTiming: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: apiTiming.api_call_time,
            processing_time: Math.round((apiTiming.processing_time + localProcessingTime) * 100) / 100,
            function_name: 'submitItemID'
        };

        console.log(`🏁 getMarketData completed in ${overallTiming.total_time}ms`);


        if (!itemInfo) {
            return {
                itemID: itemID.toString(),
                info: null,
                error: "Item not found",
            };
        }
        return {
            itemID: itemID.toString(),
            info: itemInfo,
        };

    } catch (error) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        console.error(`submitItemID error after ${Math.round(totalTime * 100) / 100}ms:`, error);

        return {
            itemID: null,
            info: null,
            error: error instanceof Error ? error.message : "Unknown error",
            timing: {
                total_time: Math.round(totalTime * 100) / 100,
                api_call_time: 0,
                processing_time: 0,
                function_name: 'submitItemID_error'
            }
        };
    }
}
