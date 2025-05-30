'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MarketSearch from "@/app/ui/market/market-search";
import ItemDisplay from "@/app/ui/market/item-display";
import {submitItemID} from "@/app/ui/market/item-search-actions";
import {NavigateOptions} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ItemInfo {
    itemid: number,
    high: number,
    highTime: number,
    low: number,
    lowTime: number
    average: number,
    details: Record<string, any>,
}


export default function Page(href: string, options?: NavigateOptions) {
    const [itemCache, setItemCache] = useState<Map<string, ItemInfo>>(new Map());
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<ItemInfo | null>(null);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Get item ID from URL on mount
    const itemIdFromUrl = searchParams.get('item');

    const fetchItemDataFromUrl = async (itemId: string) => {
        if (itemCache.has(itemId)) {
            setSearchResults(itemCache.get(itemId)!);
            return;
        }
        setIsLoading(true);
        try {
            console.log('Fetching data for URL item:', itemId);

            // Create FormData to match your server action signature
            const formData = new FormData();
            formData.append('itemID', itemId);

            // Call your existing server action
            const result = await submitItemID({ itemID: null, info: null }, formData);

            console.log('Server action result:', result);

            if (result.info && !result.error) {
                // @ts-ignore
                setItemCache(prev => new Map(prev).set(itemId, result.info));
                // @ts-ignore
                setSearchResults(result.info);
            } else {
                console.error('Error from server action:', result.error);
                setSearchResults(null);
            }
        } catch (error) {
            console.error('Error calling server action:', error);
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Update current item ID and fetch data when URL changes
    useEffect(() => {
        if (itemIdFromUrl !== currentItemId) {
            setCurrentItemId(itemIdFromUrl);
            if (itemIdFromUrl) {
                fetchItemDataFromUrl(itemIdFromUrl);
            } else {
                setSearchResults(null);
            }
        }
    }, [itemIdFromUrl]);

    const handleSearchResults = (results: ItemInfo | null, itemId: string | null) => {
        setSearchResults(results);

        if (itemId && itemId !== itemIdFromUrl) {
            console.log('Updating URL to:', itemId);
            router.push(`/market?item=${itemId}`);
        } else if (!itemId && itemIdFromUrl) {
            console.log('Clearing URL params');
            router.push('/market');
        }
    };


    return(
        <div className="min-h-screen ">
            <div className="flex flex-col w-full h-full items-center justify-center gap-12">
                <h2 className="text-4xl font-bold leading-tight mt-4">
                    Market
                </h2>

                <MarketSearch
                    onSearchResults={handleSearchResults}
                    initialItemId={currentItemId}
                />
                <ItemDisplay
                    itemInfo={searchResults}
                    itemId={currentItemId}
                />
            </div>
        </div>

    );
}