'use client'
import {getCraftingMethods} from "@/app/ui/skills/tables/get-crafting-methods";
import React, {useEffect, useState} from "react";
import {StarIcon} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';
import {PriceWarning} from "@/app/ui/skills/tables/price-warning";
import {fetchItemPrice, fetchSimpleResponse, SimpleResponse} from "@/app/ui/market/item-search-actions";

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

interface CraftingTableProps {
    xpNeeded?: number;
}

const loadingTable = (
    <div className="">
        <div className="mb-4 flex justify-between items-center">
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
                <StarIcon className="h-5 w-5" />
                Show Favorites
            </button>

        </div>

        <div className="flow-root min-w-full align-middle rounded-lg bg-gray-50 p-2">
            <table className="text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr className="items-center justify-center">
                    <th scope="col" className="px-4 py-5 font-medium pl-6">
                        Fav
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium pl-6">
                        Lvl
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Product
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Exp
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Exp/hr
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium w-56">
                        Required Materials
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Cost
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Price
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Profit
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                        Profit/hr
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr
                        className="w-full border-b py-3 text-sm last-of-type:border-none"
                    >
                        <td className="px-4 py-2">
                                    <StarIcon className="h-5 w-5" />
                        </td>
                        <td className="px-4 py-2">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
)

interface ItemInfo {
    itemid: number,
    high: number,
    highTime: number,
    low: number,
    lowTime: number,
    average: number
}

type SearchData = {
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
};

export default function CraftingTable({ xpNeeded }: CraftingTableProps) {
    const [items, setItems] = useState<CraftingItem[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [loading, setLoading] = useState(true);

    const [priceData, setPriceData] = useState<Record<number, any>>({});
    const [loadingPrices, setLoadingPrices] = useState(false);

    //States for SimpleResponse data
    const [simpleResponseData, setSimpleResponseData] = useState<Record<number, SimpleResponse>>({});
    const [loadingSimpleResponse, setLoadingSimpleResponse] = useState(false);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCraftingMethods();
                setItems(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('craftingFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('craftingFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const displayItems = showOnlyFavorites
        ? items.filter(item => favorites.includes(item.id))
        : items;

    // Fetch all liva data & calculations
    useEffect(() => {
        const fetchAllPrices = async () => {
            if (displayItems.length === 0) return;
            setLoadingPrices(true);

            const pricePromises = displayItems.map(async (item) => {
                try {
                    const price = await fetchItemPrice(item.id);
                    return { id: item.id, price };
                } catch (error) {
                    console.error(`Error fetching price for item ${item.id}:`, error);
                    return { id: item.id, price: null };
                }
            });

            try {
                const results = await Promise.all(pricePromises);
                const priceMap = results.reduce((acc, { id, price }) => {
                    acc[id] = price;
                    return acc;
                }, {} as Record<number, any>);

                setPriceData(priceMap);
            } catch (error) {
                console.error('Error fetching prices:', error);
            } finally {
                setLoadingPrices(false);
            }
        };
        fetchAllPrices();
    }, [displayItems]);

    // Fetch SimpleResponse data for each item
    useEffect(() => {
        const fetchAllSimpleResponses = async () => {
            if (displayItems.length === 0) return;
            setLoadingSimpleResponse(true);

            const simpleResponsePromises = displayItems.map(async (item) => {
                try {
                    const response = await fetchSimpleResponse(item);
                    return { id: item.id, response };
                } catch (error) {
                    console.error(`Error fetching simple response for item ${item.id}:`, error);
                    return { id: item.id, response: null };
                }
            });

            try {
                const results = await Promise.all(simpleResponsePromises);
                const responseMap = results.reduce((acc, { id, response }) => {
                    if (response) {
                        acc[id] = response;
                    }
                    return acc;
                }, {} as Record<number, SimpleResponse>);

                setSimpleResponseData(responseMap);
            } catch (error) {
                console.error('Error fetching simple responses:', error);
            } finally {
                setLoadingSimpleResponse(false);
            }
        };
        fetchAllSimpleResponses();
    }, [displayItems]);

    // Helper function to render cost cell using SimpleResponse
    const renderCostCell = (item: CraftingItem) => {
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const simpleResponse = simpleResponseData[item.id];

        if (simpleResponse) {
            return (
                <div className="flex flex-col">
                    <div className="font-medium">
                        {simpleResponse.cost?.toLocaleString() || 'N/A'}
                    </div>
                </div>
            );
        }

        // Fallback to static cost
        return <span className="text-gray-600">'N/A'</span>;
    };

    // Helper function to render profit cell using SimpleResponse
    const renderProfitCell = (item: CraftingItem) => {
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const simpleResponse = simpleResponseData[item.id];

        if (simpleResponse) {
            const profit = simpleResponse.profit;
            const isPositive = profit && profit > 0;
            const isNegative = profit && profit < 0;

            return (
                <div className="flex flex-col">
                    <div className={`font-medium ${
                        isPositive ? 'text-green-600' :
                            isNegative ? 'text-red-600' :
                                'text-gray-600'
                    }`}>
                        {profit?.toLocaleString() || 'N/A'}
                    </div>
                </div>
            );
        }

        // Fallback to static profit
        return <span className="text-gray-600">'N/A'</span>;
    };

    // Helper function to render profit/hr cell using SimpleResponse
    const renderProfitHrCell = (item: CraftingItem) => {
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const simpleResponse = simpleResponseData[item.id];

        if (simpleResponse) {
            const profit = simpleResponse.profit_hr;
            const isPositive = profit && profit > 0;
            const isNegative = profit && profit < 0;

            return (
                <div className="flex flex-col">
                    <div className={`font-medium ${
                        isPositive ? 'text-green-600' :
                            isNegative ? 'text-red-600' :
                                'text-gray-600'
                    }`}>
                        {simpleResponse.profit_hr?.toLocaleString() || 'N/A'}
                    </div>
                </div>
            );
        }

        // Fallback to static profit rate
        return <span className="text-gray-600">'N/A'</span>;
    };

    // Helper function to render price cell
    const renderPriceCell = (item: any) => {
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const simpleResponse = simpleResponseData[item.id];

        if (simpleResponse) {
            return (
                <div className="flex flex-col">
                    <div className="font-medium">
                        {simpleResponse.price?.toLocaleString() || 'N/A'}
                    </div>
                </div>
            );
        }

        // Fallback to static price if available
        return <span className="text-gray-600">'N/A'</span>;
    };
    // Helper function to render price cell
    const renderPriceCell11 = (item: any) => {
        if (loadingPrices) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const livePrice = priceData[item.id];

        if (livePrice) {
            return (
                <div className="flex flex-col">
                    <div className="font-medium text-green-600">
                        {livePrice.average?.toLocaleString()}
                    </div>

                    <div className="text-xs text-gray-500">
                        {livePrice.low?.toLocaleString()} / {livePrice.high?.toLocaleString()}
                    </div>

                </div>
            );
        }

    };


// Helper function to render ingredients cell
    const renderIngredientsCell = (item: CraftingItem) => {
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }

        const simpleResponse = simpleResponseData[item.id];

        if (simpleResponse?.ingredients_data) {
            return (
                <div className="flex flex-col space-y-1 max-w-xs">
                    {Object.entries(simpleResponse.ingredients_data).map(([itemId, data]: [string, any]) => (
                        <div key={itemId} className="flex justify-start gap-2 text-xs">
                        <span className="text-gray-600 ml-2">
                            {data.quantity}x
                        </span>
                        <span className="font-medium truncate">
                            {data.name || `Item ${itemId}`}
                        </span>
                            <span className="font-medium truncate">
                            @ {data.total_cost || `Item ${itemId}`}
                        </span>

                        </div>
                    ))}
                </div>
            );
        }

        // Fallback to static required_materials
        return <span className="text-gray-600 text-xs">{item.required_materials}</span>;
    };


    const calculateTotalCost = (item: CraftingItem) => {
        if (!xpNeeded || !item.exp) return null;
        const actionsNeeded = Math.ceil(xpNeeded / item.exp);
        if (loadingSimpleResponse) {
            return <span className="text-gray-500">Loading...</span>;
        }
        const simpleResponse = simpleResponseData[item.id];
        const profit = simpleResponse.profit;

        return profit as number * actionsNeeded
    };

    const calculateActionsNeeded = (item: CraftingItem) => {
        if (!xpNeeded || !item.exp) return null;
        return Math.ceil(xpNeeded / item.exp);
    }

    // skeleton table while data is loading
    if (loading) {
        return loadingTable
    }

    return (
        <div className="">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                    {showOnlyFavorites ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                    ) : (
                        <StarIcon className="h-5 w-5" />
                    )}
                    {showOnlyFavorites ? 'Show All' : 'Show Favorites'}
                </button>
                <PriceWarning />
            </div>

            <div className="flow-root min-w-full align-middle rounded-lg bg-gray-50 p-2">
                <table className="text-gray-900">
                    <thead className="rounded-lg text-left text-sm font-normal">
                        <tr className="items-center justify-center">
                            <th scope="col" className="px-4 py-5 font-medium pl-6">
                                Fav
                            </th>
                            <th scope="col" className="px-4 py-5 font-medium pl-6">
                                Lvl
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Product
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Exp
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Exp/hr
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium w-56">
                                Required Materials
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Cost
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Price
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Profit
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Profit/hr
                            </th>
                            {typeof xpNeeded === 'number' && (
                                <>
                                    <th scope="col" className="px-3 py-5 font-medium">Actions</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Total Profit</th>
                                </>
                            )}

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {displayItems.map((item) => (
                        <tr
                            key={item.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none"
                        >
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
                            <td className="px-4 py-2 text-center">{item.exp_rate.toLocaleString()}</td>
                            <td className="px-4 py-2 text-center">
                                {renderIngredientsCell(item)}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {renderCostCell(item)}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {renderPriceCell(item)}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {renderProfitCell(item)}
                            </td>
                            <td className="px-4 py-2 text-center">
                                {renderProfitHrCell(item)}
                            </td>
                            {typeof xpNeeded === 'number' && (
                                <>
                                    <td className="px-4 py-2 text-center">
                                        {calculateActionsNeeded(item)?.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {calculateTotalCost(item)?.toLocaleString()}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

