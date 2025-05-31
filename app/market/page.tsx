'use client'
import React, {useState, useEffect, useRef} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MarketSearch from "@/app/ui/market/market-search";
import ItemDisplay from "@/app/ui/market/item-display";
import {fetchItemID} from "@/app/ui/market/market-search-actions";
import {NavigateOptions} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ItemInfo} from "@/app/lib/types";

export default function Page(href: string, options?: NavigateOptions) {
    const router = useRouter();
    const processedItemRef = useRef<string | null>(null);

    const [itemCache, setItemCache] = useState<Map<string, ItemInfo>>(new Map());
    const searchParams = useSearchParams();
    const [searchResults, setSearchResults] = useState<ItemInfo | null>(null);
    const [currentItemId, setCurrentItemId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const itemIdFromUrl = searchParams.get('item');

    const fetchItemDataFromUrl = async (itemId: string) => {
        // Skip if already processing this item
        if (processedItemRef.current === itemId || isLoading) return;
        processedItemRef.current = itemId;
        setIsLoading(true);

        if (itemCache.has(itemId)) {
            setSearchResults(itemCache.get(itemId)!);
            setIsLoading(false);

            return;
        }

        try {
            // Create FormData to match your server action signature
            const formData = new FormData();
            formData.append('itemID', itemId);

            // Get data from API-intermediate
            const result = await fetchItemID({ itemID: null, info: null }, formData);

            if (result.info && !result.error) {
                if (result.info) {
                    setItemCache(prev => new Map(prev).set(itemId, result.info as ItemInfo));
                    setSearchResults(result.info);
                }
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
        if (!itemIdFromUrl) {
            setCurrentItemId(null);
            setSearchResults(null);
            processedItemRef.current = null;
            return;
        }

        // Skip if item already processed
        if (itemIdFromUrl === currentItemId || processedItemRef.current === itemIdFromUrl) {
            return;
        }

        setCurrentItemId(itemIdFromUrl);
        fetchItemDataFromUrl(itemIdFromUrl);

    }, [itemIdFromUrl]);


    const handleSearchResults = (results: ItemInfo | null, itemId: string | null) => {
        // Don't update state or URL if item is already loaded
        if (itemId === currentItemId) return;

        setSearchResults(results);

        if (itemId && itemId !== itemIdFromUrl && !isLoading) {
            processedItemRef.current = itemId;
            router.push(`/market?item=${itemId}`);
        } else if (!itemId && itemIdFromUrl) {
            processedItemRef.current = null;
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