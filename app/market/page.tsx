'use client'

import React, {useState, useEffect, useCallback, Suspense, useRef} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MarketSearch from "@/app/ui/market/market-search";
import ItemDisplay from "@/app/ui/market/item-display";
import { fetchItemID } from "@/app/ui/market/market-search-actions";
import { ItemInfo } from "@/app/lib/types";

export default function Page() {
    const router = useRouter();
    const [itemCache, setItemCache] = useState<Map<string, ItemInfo>>(new Map());

    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<ItemInfo | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const itemIdFromUrl = searchParams.get('item');

    const pendingRequestRef = useRef<string | null>(null);

    const fetchItemData = useCallback(async (itemId: string) => {
        if (!itemId || pendingRequestRef.current === itemId) return;

        // Check cache first
        const cachedItem = itemCache.get(itemId);
        if (cachedItem) {
            setSearchResults(cachedItem);
            return;
        }

        pendingRequestRef.current = itemId;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('itemID', itemId);

            const result =
                await fetchItemID({ itemID: null, info: null }, formData);

            if (result.info && !result.error) {
                setItemCache(prev => new Map(prev).set(itemId, result.info as ItemInfo));
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
            pendingRequestRef.current = null;
        }
    }, [itemCache]);

    const handleItemSelected = useCallback((itemId: string | null) => {
        if (itemId && itemId !== itemIdFromUrl) {
            router.push(`/market?item=${itemId}`);
        } else if (!itemId && itemIdFromUrl) {
            router.push('/market');
        }
    }, [itemIdFromUrl, router]);

    // Handle URL changes
    useEffect(() => {
        if (itemIdFromUrl) {
            fetchItemData(itemIdFromUrl);
        } else {
            setSearchResults(null);
        }
    }, [itemIdFromUrl, fetchItemData]);

    return(
        <div className="min-h-screen ">
            <div className="flex flex-col w-full h-full items-center justify-center gap-12">
                <h2 className="text-4xl font-bold leading-tight mt-4">
                    Market
                </h2>

                <MarketSearch
                    onItemSelected={handleItemSelected}
                    isLoading={isLoading}
                />

                <ItemDisplay
                    itemInfo={searchResults}
                    isLoading={isLoading}
                />

            </div>
        </div>

    );
}