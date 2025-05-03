'use server'

import {fetchCraftingMethods} from '@/app/lib/data';

export async function getCraftingMethods() {
    try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return await fetchCraftingMethods();
    } catch (error) {
        console.error('Error fetching crafting methods:', error);
        throw new Error('Failed to fetch crafting methods');
    }
}
