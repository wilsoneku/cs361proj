'use server';
import zmq from 'zeromq';

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
};

export interface SimpleResponse {
    cost: number | null;
    price: number | null;
    profit: number | null;
    profit_hr: number | null;
    ingredients_cost: number | null;
    ingredients_data: Record<string, any> | null;
    full_item_cost: number | null;
}

interface CraftingItem {
    id: number;
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    ingredients: Record<string, any>;
    required_materials: string;
    cost?: number;
    price?: number;
    profit?: number;
    profit_rate?: number;
    xpNeeded?: number;
}

async function sendItemId(itemID:any) {
    try {
        const sock = new zmq.Request();
        sock.connect("tcp://localhost:8001")
        console.log('Connected to port 8001')

        const payload = {'itemid': itemID}

        await sock.send(JSON.stringify(payload))

        const result = await sock.receive()
        const jsonData = JSON.parse(result.toString())
        console.log(jsonData)

        return jsonData

    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

function getItemInfo(data: any, itemId: string | number) {
    try {
        // Early return if no data array
        if (!data?.data) {
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
            return {
                itemid: idStr,
                high: itemData.high,
                highTime: itemData.highTime,
                low: itemData.low,
                lowTime: itemData.lowTime,
                average: itemData.average
            };
        }
        console.log('Item not found or invalid data');
        return null;

    } catch (error) {
        console.error('Error processing data:', error);
        return null;
    }

}

export async function submitItemID(
    prevState: SearchData,
    payload: FormData
): Promise<SearchData> {
    try {
        // Debug: Log all form data
        console.log('Form data entries:');
        for (const [key, value] of payload.entries()) {
            console.log(`${key}: ${value}`);
        }

        // extract itemID from received form
        const itemID = payload.get("itemID");
        console.log('Extracted itemID:', itemID);
        if (!itemID) {
            return { itemID: null, info: null, error: "No item ID provided" };
        }

        // fetch live item data from API
        const data = await sendItemId(itemID);
        // repackage data
        const itemInfo = getItemInfo(data, itemID.toString());

        if (!itemInfo) {
            return {
                itemID: itemID.toString(),
                info: null,
                error: "Item not found"
            };
        }

        return { itemID: itemID.toString(), info: itemInfo };
    } catch (error) {
        console.error(error);
        return {
            itemID: null,
            info: null,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

export async function fetchItemPrice(itemId: string | number): Promise<ItemInfo | null> {
    try {
        const data = await sendItemId(itemId);
        return getItemInfo(data, itemId);
    } catch (error) {
        console.error('Error fetching item price:', error);
        return null;
    }
}

// Helper function to parse ingredients
function parseIngredients(ingredients: any): Record<string, number> {
    if (typeof ingredients === 'object' && ingredients !== null) {
        return ingredients;  // Already an object
    }

    if (typeof ingredients === 'string') {
        try {
            //Try direct JSON parse after cleaning
            const cleaned = ingredients
                .replace(/'/g, '"')  // Replace single quotes
                .replace(/(\w+):/g, '"$1":')  // Quote keys
                .replace(/([{,]\s*)(\w+):/g, '$1"$2":');  // Ensure all keys are quoted

            return JSON.parse(cleaned);
        } catch (e) {
            const result: Record<string, number> = {};
            const pairs = ingredients
                .replace(/[{}]/g, '')  // Remove braces
                .split(',')  // Split by comma
                .map(pair => pair.trim());

            pairs.forEach(pair => {
                const [key, value] = pair.split(':').map(s => s.trim());
                if (key && value) {
                    result[key] = parseInt(value) || 0;
                }
            });

            return result;
        }
    }

    return {};
}

export async function fetchSimpleResponse(item: CraftingItem): Promise<SimpleResponse | null> {
    try {
        const payload = {
            item_data: {
                item_id: item.id,
                exp: parseInt(item.exp.toString()),
                exp_hr: parseInt(item.exp_rate.toString()),
                ingredients: parseIngredients(item.ingredients),  // Use the parser
                cost: item.cost,
                price: item.price,
                profit: item.profit,
                profit_hr: item.profit_rate,
            }
        };

        console.log(`Sending request for item ${item.id}:`, payload);

        const response = await fetch('http://localhost:8000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching simple response for item ${item.id}:`, error);
        return null;
    }
}