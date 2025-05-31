'use server'
import {CraftingItem, SimpleResponse, TimingInfo, BatchResponse} from "@/app/lib/types";

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

export async function fetchTableData(items: CraftingItem[]): Promise<BatchResponse> {
    const functionStart = performance.now();
    console.log(`🚀 fetchTableData starting for ${items.length} items`);

    try {
        // Prepare batch payload
        const batchPayload = {
            requests: items.map(item => ({
                item_data: {
                    item_id: item.id,
                    exp: parseInt(item.exp.toString()),
                    exp_hr: parseInt(item.exp_rate.toString()),
                    ingredients: parseIngredients(item.ingredients),
                }
            }))
        };

        const itemIdList = batchPayload.requests.map(request => request.item_data.item_id).join(', ')
        console.log(`📦 requestList: ${itemIdList}`);

        const apiCallStart = performance.now();

        // Send single batch request
        const response = await fetch('http://localhost:8002/load_table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchPayload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const batchResponse = await response.json();
        const apiCallEnd = performance.now();
        const apiCallTime = apiCallEnd - apiCallStart;

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        // Create timing info
        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(apiCallTime * 100) / 100,
            processing_time: Math.round((totalTime - apiCallTime) * 100) / 100,
            function_name: 'fetchBatchSimpleResponse_batch',
            items_processed: items.length,
            individual_times: [] // Not applicable for batch requests
        };

        console.log(`🏁 fetchTableData complete: ${timing.api_call_time}ms`);

        return {
            results: batchResponse.results || {},
            timing,
            errors: batchResponse.errors || {}
        };

    } catch (error) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        console.error(`❌ fetchTableData (BATCH) failed after ${Math.round(totalTime * 100) / 100}ms:`, error);

        return {
            results: {},
            errors: { batch: error instanceof Error ? error.message : 'Batch request failed' },
            timing: {
                total_time: Math.round(totalTime * 100) / 100,
                api_call_time: 0,
                processing_time: 0,
                function_name: 'fetchTableData_batch_error',
                items_processed: 0
            }
        };
    }
}