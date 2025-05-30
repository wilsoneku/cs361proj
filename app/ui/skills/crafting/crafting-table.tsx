'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {
    compareBatchPerformance,
    CraftingItem,
    fetchBatchSimpleResponse,
    SimpleResponse
} from '@/app/ui/skills/tables/table-load-actions';
import { fetchCraftingMethods } from '@/app/lib/data';
import {
    calculateActionsNeeded,
    calculateTotalCost,
    renderIngredientsCell,
    renderCostCell,
    renderPriceCell,
    renderProfitCell,
    renderProfitHrCell,
    filterItemsByFavorites
} from '@/app/ui/skills/crafting/crafting-helpers';

interface CraftingTableProps {
    xpNeeded?: number | undefined;
}

export default function CraftingTable({xpNeeded}: CraftingTableProps) {
    const [items, setItems] = useState<CraftingItem[]>([]);
    const [loadedData, setLoadedData] = useState<Record<string, SimpleResponse>>({});
    const [isLoadingBase, setIsLoadingBase] = useState(true);
    const [isLoadingMarket, setIsLoadingMarket] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Load base crafting methods data when component mounts
    useEffect(() => {
        loadBaseCraftingData();
    }, []);

    const loadBaseCraftingData = async () => {
        setIsLoadingBase(true);
        try {
            const data = await fetchCraftingMethods();
            setItems(data);
        } catch (error) {
            console.error('Database error loading crafting methods:', error);
            setErrors({ database: error instanceof Error ? error.message : 'Database error' });
        } finally {
            setIsLoadingBase(false);
        }
    };

    const compareBatchSpeed = async () => {
        try {
            const results = await compareBatchPerformance(items);
        } catch (error) {
            console.error('Database error loading crafting methods:', error);
            setErrors({ database: error instanceof Error ? error.message : 'Database error' });
        }
    };

    // Load market data when items change
    useEffect(() => {
        if (items.length > 0) {
            loadAllMarketData();
            // compareBatchSpeed();
        }
    }, [items]);

    const loadAllMarketData = async () => {
        if (items.length === 0) return;

        setIsLoadingMarket(true);
        setErrors({});

        try {
            const result = await fetchBatchSimpleResponse(items);

            const validData: Record<string, SimpleResponse> = {};
            Object.entries(result.results).forEach(([itemId, response]) => {
                if (response) {
                    validData[itemId] = response;
                }
            });

            setLoadedData(validData);
            setErrors(result.errors);

        } catch (error) {
            console.error('Market data error:', error);
            setErrors({ market: error instanceof Error ? error.message : 'Market data error' });
        } finally {
            setIsLoadingMarket(false);
        }
    };

    // Initialize favorites from sessionStorage
    const [favorites, setFavorites] = useState<number[]>(() => {
        if (typeof window !== 'undefined') {
            const savedFavorites = sessionStorage.getItem('crafting-favorites');
            return savedFavorites ? JSON.parse(savedFavorites) : [];
        }
        return [];
    });

    // Save favorites to sessionStorage whenever favorites change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('crafting-favorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    const toggleFavorite = (itemId: number) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(itemId)
                ? prev.filter(id => id !== itemId)  // Remove from favorites
                : [...prev, itemId];                // Add to favorites

            console.log(`Item ${itemId} ${prev.includes(itemId) ? 'removed from' : 'added to'} favorites (session)`);
            return newFavorites;
        });
    };

    // Clear all favorites function
    const clearAllFavorites = () => {
        setFavorites([]);
        sessionStorage.removeItem('crafting-favorites');
    };


    const getItemData = (itemId: number): SimpleResponse | null => {
        return loadedData[itemId.toString()] || null;
    };

    const displayItems = useMemo(() => {
        return filterItemsByFavorites(items, favorites, showFavoritesOnly);
    }, [items, favorites, showFavoritesOnly]);

    // Loading state
    if (isLoadingBase) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900">Loading Crafting Methods...</h3>
                    <p className="text-gray-500">Fetching data from database...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (items.length === 0) {
        return (
            <div className="text-center p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">No Crafting Methods Found</h3>
                <button
                    onClick={loadBaseCraftingData}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between mb-6 ">
                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    disabled={favorites.length === 0}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        showFavoritesOnly
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : favorites.length > 0
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    <span>
                        {showFavoritesOnly ? 'Show All' : 'Show Favorites'}
                    </span>
                </button>
                <button
                    onClick={loadAllMarketData}
                    disabled={isLoadingMarket || items.length === 0}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {isLoadingMarket ? 'Refreshing...' : 'Refresh Market Data'}
                </button>
            </div>

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
                    {Object.entries(errors).map(([key, error]) => (
                        <div key={key} className="text-red-700 text-sm">
                            <strong>{key}:</strong> {error}
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="flow-root align-middle rounded-lg bg-gray-50 p-2">
                <table className="text-gray-900 w-full table-fixe">
                    <thead className="rounded-lg text-left text-sm font-normal">
                    <tr className="items-center justify-center">
                        <th scope="col" className="px-4 py-5 font-medium pl-6">Fav</th>
                        <th scope="col" className="px-4 py-5 font-medium pl-6">Lvl</th>
                        <th scope="col" className="px-3 py-5 font-medium">Product</th>
                        <th scope="col" className="px-3 py-5 font-medium">Exp</th>
                        <th scope="col" className="px-3 py-5 font-medium">Exp/hr</th>
                        <th scope="col" className="px-3 py-5 font-medium w-56">Required Materials</th>
                        <th scope="col" className="px-3 py-5 font-medium">Cost</th>
                        <th scope="col" className="px-3 py-5 font-medium">Price</th>
                        <th scope="col" className="px-3 py-5 font-medium">Profit</th>
                        <th scope="col" className="px-3 py-5 font-medium">Profit/hr</th>
                        {(xpNeeded && typeof xpNeeded === 'number' && xpNeeded > 0) && (
                            <>
                                <th scope="col" className="px-3 py-5 font-medium">Actions</th>
                                <th scope="col" className="px-3 py-5 font-medium">Total Profit</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {displayItems.map((item) => {
                        const itemData = getItemData(item.id);
                        const hasError = errors[item.id.toString()];

                        return (
                            <tr key={item.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => toggleFavorite(item.id)}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        {favorites.includes(item.id) ? (
                                            <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                        ) : (
                                            <StarIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </td>
                                <td className="px-4 py-2 text-center">{item.lvl}</td>
                                <td className="px-4 py-2 text-center">{item.product}</td>
                                <td className="px-4 py-2 text-center">{item.exp}</td>
                                <td className="px-4 py-2 text-center">{item.exp_rate}</td>
                                <td className="px-4 py-2 text-center">
                                    {renderIngredientsCell(item, isLoadingMarket, getItemData)}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {renderCostCell(itemData, hasError as unknown as boolean, isLoadingMarket)}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {renderPriceCell(itemData, hasError as unknown as boolean, isLoadingMarket)}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {renderProfitCell(itemData, hasError as unknown as boolean, isLoadingMarket)}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {renderProfitHrCell(itemData, hasError as unknown as boolean, isLoadingMarket)}
                                </td>
                                {(xpNeeded && typeof xpNeeded === 'number' && xpNeeded > 0)&& (
                                    <>
                                        <td className="px-4 py-2 text-center">
                                            {calculateActionsNeeded(item, xpNeeded)?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {calculateTotalCost(item, itemData, xpNeeded)?.toLocaleString()}
                                        </td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
