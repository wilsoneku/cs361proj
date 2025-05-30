'use server';

type ItemInfo = {
    itemid: string;
    high: number;
    highTime: number;
    low: number;
    lowTime: number;
    average: number;
};

type SearchData = {
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
    timing?: TimingInfo;
};

interface TimingInfo {
    total_time: number;
    api_call_time: number;
    processing_time: number;
    function_name: string;
}

async function getData(itemid:any) {
    const functionStart = performance.now();
    const url = 'http://localhost:8001/market-data/'
    const payload = {'itemid': itemid}
    console.log('payload: ' + payload)
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
        const data = JSON.parse(text);
        const processingEnd = performance.now();
        const processingTime = processingEnd - processingStart;

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(apiCallTime * 100) / 100,
            processing_time: Math.round(processingTime * 100) / 100,
            function_name: 'getData'
        };

        console.log(`getData timing for item ${itemid}:`, timing);
        console.log(`API call: ${timing.api_call_time}ms`);
        console.log(`Processing: ${timing.processing_time}ms`);
        console.log(`Total: ${timing.total_time}ms`);

        return { data, timing };

    } catch (error: any) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: 0,
            processing_time: 0,
            function_name: 'getData_error'
        };
        console.error(`getData error after ${timing.total_time}ms:`, error.message);
        return { data: null, timing };
    }
}

async function getItemDetails(itemid:any) {
    const url = 'http://localhost:8001/item-details/'
    const payload = {'itemid': itemid}

    try {
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
        return await response.json();
    }
    catch {
        console.log('Error getting item details')
        return null;
    }
}

function parseData(data: any, details:any, itemId: string | number) {
    const processingStart = performance.now();

    try {
        // Early return if no data array
        if (!data?.data) {
            console.log('No item data found');
            return null;
        }

        //Early return if no details array
        if (!details?.item) {
            console.log('No item data found');
            return null;
        }

        const idStr = String(itemId);
        const itemData = data.data[idStr];

        if (
            itemData &&
            typeof itemData.high === 'number' &&
            typeof itemData.low === 'number'
        ) {
            const result = {
                itemid: idStr,
                high: itemData.high,
                highTime: itemData.highTime,
                low: itemData.low,
                lowTime: itemData.lowTime,
                average: itemData.average,
                details: details,
            }
            const processingEnd = performance.now();
            const processingTime = processingEnd - processingStart;
            console.log(`parseData processing: ${Math.round(processingTime * 100) / 100}ms`);

            return result;
        }
        console.log('Item not found or invalid data');
        return null;

    } catch (error) {
        const processingEnd = performance.now();
        const processingTime = processingEnd - processingStart;
        console.error(`parseData error after ${Math.round(processingTime * 100) / 100}ms:`, error);
        return null;
    }

}


export async function submitItemID(
    prevState: SearchData,
    payload: FormData
): Promise<SearchData> {
    const functionStart = performance.now();

    try {
        console.log('Form data entries:');
        for (const [key, value] of payload.entries()) {
            console.log(`${key}: ${value}`);
        }

        // extract itemID from  form
        const itemID = payload.get("itemID");
        console.log('Extracted itemID:', itemID);
        if (!itemID) {
            return { itemID: null, info: null, error: "No item ID provided" };
        }

        // Time the API call
        const { data, timing: apiTiming } = await getData(itemID);
        const details = await getItemDetails(itemID);

        // repackage data
        const processingStart = performance.now();
        const itemInfo = parseData(data, details, itemID.toString());
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
        console.log(`submitItemID complete timing:`, overallTiming);

        if (!itemInfo) {
            return {
                itemID: itemID.toString(),
                info: null,
                error: "Item not found",
                timing: overallTiming
            };
        }
        return {
            itemID: itemID.toString(),
            info: itemInfo,
            timing: overallTiming
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
