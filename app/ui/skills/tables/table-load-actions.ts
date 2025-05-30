'use server'

export interface CraftingItem {
    id: number;
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    ingredients: Record<string, any>;
    xpNeeded?: number;
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

export interface IngredientsData {
    'name': string
    'avg_cost': number,
    'high_cost': number,
    'low_cost': number,
    'quantity': number,
    'total_cost': number,
}

export interface TimingInfo {
    total_time: number;
    api_call_time: number;
    processing_time: number;
    function_name: string;
    items_processed?: number;
    individual_times?: number[];
}

export interface BatchResponse {
    results: Record<string, SimpleResponse | null>;
    timing: TimingInfo;
    errors: Record<string, string>;
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
    const functionStart = performance.now();

    try {
        const payload = {
            item_data: {
                item_id: item.id,
                exp: parseInt(item.exp.toString()),
                exp_hr: parseInt(item.exp_rate.toString()),
                ingredients: parseIngredients(item.ingredients),  // Use the parser
                // cost: item.cost,
                // price: item.price,
                // profit: item.profit,
                // profit_hr: item.profit_rate,
            }
        };
        console.log(`Fetching simpleRequest for item ${item.id}:`, payload);

        const apiCallStart = performance.now();

        const response = await fetch('http://localhost:8002/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const apiCallEnd = performance.now();
        const apiCallTime = apiCallEnd - apiCallStart;

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(apiCallTime * 100) / 100,
            processing_time: Math.round((totalTime - apiCallTime) * 100) / 100,
            function_name: 'fetchSimpleResponse'
        };

        console.log(`fetchSimpleResponse complete for item ${item.id}:`, timing);
        console.log(`  API call: ${timing.api_call_time}ms`);
        console.log(`  Processing: ${timing.processing_time}ms`);
        console.log(`  Total: ${timing.total_time}ms`);

        // Add timing to the response
        return {
            ...data,
            timing
        };

    } catch (error) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        console.error(`fetchSimpleResponse error for item ${item.id} after ${Math.round(totalTime * 100) / 100}ms:`, error);
        return null;
    }
}

export async function fetchBatchSimpleResponse(items: CraftingItem[]): Promise<BatchResponse> {
    const functionStart = performance.now();
    console.log(`🚀 fetchBatchSimpleResponse starting for ${items.length} items`);

    const results: Record<string, SimpleResponse | null> = {};
    const errors: Record<string, string> = {};
    const individualTimes: number[] = [];

    try {
        // Create parallel requests for all items
        const apiCallStart = performance.now();

        const requests = items.map(async (item) => {
            const itemStart = performance.now();

            try {
                const payload = {
                    item_data: {
                        item_id: item.id,
                        exp: parseInt(item.exp.toString()),
                        exp_hr: parseInt(item.exp_rate.toString()),
                        ingredients: parseIngredients(item.ingredients),
                        // cost: item.cost,
                        // price: item.price,
                        // profit: item.profit,
                        // profit_hr: item.profit_rate,
                    }
                };

                const response = await fetch('http://localhost:8002/calculate_parallel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const itemEnd = performance.now();
                const itemTime = itemEnd - itemStart;
                individualTimes.push(itemTime);

                console.log(`✅ Item ${item.id} completed in ${Math.round(itemTime * 100) / 100}ms`);

                return {
                    itemId: item.id.toString(),
                    data: { ...data, timing: { item_time: Math.round(itemTime * 100) / 100 } },
                    error: null
                };

            } catch (error) {
                const itemEnd = performance.now();
                const itemTime = itemEnd - itemStart;
                individualTimes.push(itemTime);

                console.error(`❌ Item ${item.id} failed after ${Math.round(itemTime * 100) / 100}ms:`, error);

                return {
                    itemId: item.id.toString(),
                    data: null,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });

        // Wait for all requests to complete
        const responses = await Promise.all(requests);
        const apiCallEnd = performance.now();
        const apiCallTime = apiCallEnd - apiCallStart;

        // Process results
        responses.forEach(response => {
            if (response.data) {
                results[response.itemId] = response.data;
            } else {
                errors[response.itemId] = response.error || 'Unknown error';
            }
        });

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(apiCallTime * 100) / 100,
            processing_time: Math.round((totalTime - apiCallTime) * 100) / 100,
            function_name: 'fetchBatchSimpleResponse',
            items_processed: items.length,
            individual_times: individualTimes.map(t => Math.round(t * 100) / 100)
        };

        // Calculate performance metrics
        const avgItemTime = individualTimes.reduce((sum, t) => sum + t, 0) / individualTimes.length;

        console.log(`🏁 fetchBatchSimpleResponse complete:`);
        console.log(`   📊 Items processed: ${items.length}`);
        console.log(`   ⏱️  Parallel time: ${timing.api_call_time}ms`);
        console.log(`   📈 Average per item: ${Math.round(avgItemTime * 100) / 100}ms`);
        console.log(`   ❌ Errors: ${Object.keys(errors).length}`);

        return { results, timing, errors };

    } catch (error) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        console.error(`❌ fetchBatchSimpleResponse failed after ${Math.round(totalTime * 100) / 100}ms:`, error);

        return {
            results: {},
            errors: { batch: error instanceof Error ? error.message : 'Batch request failed' },
            timing: {
                total_time: Math.round(totalTime * 100) / 100,
                api_call_time: 0,
                processing_time: 0,
                function_name: 'fetchBatchSimpleResponse_error',
                items_processed: 0
            }
        };
    }
}

export async function fetchSerialSimpleResponse(items: CraftingItem[]): Promise<BatchResponse> {
    const functionStart = performance.now();
    console.log(`🐌 fetchSerialSimpleResponse starting for ${items.length} items`);

    const results: Record<string, SimpleResponse | null> = {};
    const errors: Record<string, string> = {};
    const individualTimes: number[] = [];

    try {
        // Process items one by one
        for (const item of items) {
            const itemStart = performance.now();

            try {
                const response = await fetchSimpleResponse(item);
                const itemEnd = performance.now();
                const itemTime = itemEnd - itemStart;
                individualTimes.push(itemTime);

                if (response) {
                    results[item.id.toString()] = response;
                    console.log(`✅ Serial item ${item.id} completed in ${Math.round(itemTime * 100) / 100}ms`);
                } else {
                    errors[item.id.toString()] = 'No response received';
                    console.log(`❌ Serial item ${item.id} failed after ${Math.round(itemTime * 100) / 100}ms`);
                }

            } catch (error) {
                const itemEnd = performance.now();
                const itemTime = itemEnd - itemStart;
                individualTimes.push(itemTime);

                errors[item.id.toString()] = error instanceof Error ? error.message : 'Unknown error';
                console.error(`❌ Serial item ${item.id} failed after ${Math.round(itemTime * 100) / 100}ms:`, error);
            }
        }

        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        const timing: TimingInfo = {
            total_time: Math.round(totalTime * 100) / 100,
            api_call_time: Math.round(totalTime * 100) / 100, // For serial, total time ≈ API time
            processing_time: 0,
            function_name: 'fetchSerialSimpleResponse',
            items_processed: items.length,
            individual_times: individualTimes.map(t => Math.round(t * 100) / 100)
        };

        console.log(`🏁 fetchSerialSimpleResponse complete:`);
        console.log(`   📊 Items processed: ${items.length}`);
        console.log(`   ⏱️  Total time: ${timing.total_time}ms`);
        console.log(`   📈 Average per item: ${Math.round(individualTimes.reduce((sum, t) => sum + t, 0) / individualTimes.length * 100) / 100}ms`);
        console.log(`   ❌ Errors: ${Object.keys(errors).length}`);

        return { results, timing, errors };

    } catch (error) {
        const functionEnd = performance.now();
        const totalTime = functionEnd - functionStart;

        console.error(`❌ fetchSerialSimpleResponse failed after ${Math.round(totalTime * 100) / 100}ms:`, error);

        return {
            results: {},
            errors: { batch: error instanceof Error ? error.message : 'Serial batch request failed' },
            timing: {
                total_time: Math.round(totalTime * 100) / 100,
                api_call_time: 0,
                processing_time: 0,
                function_name: 'fetchSerialSimpleResponse_error',
                items_processed: 0
            }
        };
    }
}

export async function compareBatchPerformance(items: CraftingItem[]): Promise<{
    parallel: BatchResponse;
    serial: BatchResponse;
    comparison: {
        speedup_factor: number;
        time_saved: number;
        parallel_errors: number;
        serial_errors: number;
    };
}> {
    console.log(`🔬 Starting performance comparison for ${items.length} items`);
    // Run both approaches
    const [parallel, serial] = await Promise.all([
        fetchBatchSimpleResponse(items),
        fetchSerialSimpleResponse(items)
    ]);

    const speedupFactor = serial.timing.total_time / parallel.timing.total_time;
    const timeSaved = serial.timing.total_time - parallel.timing.total_time;

    const comparison = {
        speedup_factor: Math.round(speedupFactor * 100) / 100,
        time_saved: Math.round(timeSaved * 100) / 100,
        parallel_errors: Object.keys(parallel.errors).length,
        serial_errors: Object.keys(serial.errors).length
    };

    console.log(`📊 Performance Comparison Results:`);
    console.log(`   🚀 Parallel: ${parallel.timing.total_time}ms`);
    console.log(`   🐌 Serial: ${serial.timing.total_time}ms`);
    console.log(`   ⚡ Speedup: ${comparison.speedup_factor}x`);
    console.log(`   💾 Time saved: ${comparison.time_saved}ms`);

    return { parallel, serial, comparison };
}