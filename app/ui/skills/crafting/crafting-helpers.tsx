import { CraftingItem, SimpleResponse } from '@/app/ui/skills/tables/table-load-actions';
import nameIdMap from '@/public/name_id_map.json';

const idToNameMap: Record<number, string> = Object.entries(nameIdMap).reduce((acc, [name, id]) => {
    acc[id as number] = name;
    return acc;
}, {} as Record<number, string>);

export const getName = (itemId: number): string => {
    return idToNameMap[itemId] || `Unknown Item ${itemId}`;
};

// Calculation helpers
export const calculateActionsNeeded = (item: CraftingItem, xpNeeded?: number): number | null => {
    if (typeof xpNeeded !== 'number' || !item.exp) return null;
    return Math.ceil(xpNeeded / item.exp);
};

export const calculateTotalCost = (item: CraftingItem, itemData: SimpleResponse | null, xpNeeded?: number): number | null => {
    const actionsNeeded = calculateActionsNeeded(item, xpNeeded);
    if (!actionsNeeded || !itemData?.profit) return null;
    return actionsNeeded * itemData.profit;
};

export const renderIngredientsCell = (item: CraftingItem, isLoadingMarket: boolean, getItemData: (itemId: number) => SimpleResponse | null) => {
    let ingredientsObj = {};
    if (typeof item.ingredients === 'string') {
        try {
            ingredientsObj = JSON.parse(item.ingredients);
        } catch {
            return item.ingredients;
        }
    } else if (typeof item.ingredients === 'object' && item.ingredients !== null) {
        ingredientsObj = item.ingredients;
    } else {
        return item.ingredients || '-';
    }

    const ingredientEntries = Object.entries(ingredientsObj);
    if (ingredientEntries.length === 0) {
        return <span className="text-gray-400">No ingredients</span>;
    }

    return (
        <div className="text-xs space-y-1">
            {ingredientEntries.map(([itemIdStr, quantity]) => {
                const itemId = parseInt(itemIdStr);
                const itemName = getName(itemId);

                // Get live price data for this ingredient
                const mainItemData = getItemData(item.id);
                const ingredientPriceData = mainItemData?.ingredients_data?.[itemIdStr];

                return (
                    <div key={itemIdStr} className="group relative">
                        <div className="cursor-help border-b border-gray-200 pb-1 last:border-b-0">
                            <span className="font-medium">
                                {quantity as unknown as number}x {itemName}
                            </span>
                            <span> </span>
                            <span className="text-gray-500 text-xs">
                                (id:{itemId})
                            </span>
                        </div>

                        {/* Tooltip with live prices */}
                        <div className="invisible group-hover:visible absolute z-50 w-64 p-3 bg-white border border-gray-300 rounded-lg shadow-lg -top-2 left-full ml-2 transition-all duration-200 scale-0 group-hover:scale-100">
                            <div className="space-y-2">
                                <div className="font-semibold text-gray-900 border-b pb-1">
                                    {itemName} (#{itemId})
                                </div>

                                {ingredientPriceData ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-600">Quantity:</span>
                                                <div className="font-medium">{quantity as unknown as number}</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Total Cost:</span>
                                                <div className="font-medium text-green-600">
                                                    {ingredientPriceData.total_cost?.toLocaleString() || 'N/A'}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-2">
                                            <div className="">
                                                <div className="text-gray-600 text-sm">Average Price:</div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {ingredientPriceData.avg_cost?.toLocaleString() || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="text-gray-600">High / Low</div>
                                                <div className="font-bold text-gray-600  ">
                                                    {ingredientPriceData.high_cost?.toLocaleString() || 'N/A'} /
                                                    {ingredientPriceData.low_cost?.toLocaleString() || 'N/A'}
                                                </div>
                                            </div>
                                        </div>

                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        {isLoadingMarket ? (
                                            <div className="text-blue-500">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                                Loading price data...
                                            </div>
                                        ) : (
                                            <div className="text-red-500">
                                                Price data unavailable
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tooltip arrow */}
                            <div className="absolute top-3 left-0 transform -translate-x-1 w-2 h-2 bg-white border-l border-t border-gray-300 rotate-45"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export const renderCostCell = (itemData: SimpleResponse | null, hasError: boolean, isLoadingMarket: boolean) => {
    if (hasError) {
        return <span className="text-red-500">Error</span>;
    }

    if (isLoadingMarket && !itemData) {
        return <span className="text-gray-500">Loading...</span>;
    }

    if (itemData?.cost) {
        return <span>{itemData.cost.toLocaleString()}</span>;
    }

    return <span className="text-gray-400">-</span>;
};

export const renderPriceCell = (itemData: SimpleResponse | null, hasError: boolean, isLoadingMarket: boolean) => {
    if (hasError) return <span className="text-red-500">Error</span>;
    if (isLoadingMarket && !itemData) return <span className="text-gray-500">Loading...</span>;

    return itemData?.price ? (
        <span>{itemData.price.toLocaleString()}</span>
    ) : (
        <span className="text-gray-400">-</span>
    );
};

export const renderProfitCell = (itemData: SimpleResponse | null, hasError: boolean, isLoadingMarket: boolean) => {
    if (hasError) return <span className="text-red-500">Error</span>;
    if (isLoadingMarket && !itemData) return <span className="text-gray-500">Loading...</span>;

    if (itemData?.profit !== null && itemData?.profit !== undefined) {
        const isPositive = itemData.profit > 0;
        return (
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {itemData.profit.toLocaleString()}
            </span>
        );
    }

    return <span className="text-gray-400">-</span>;
};

export const renderProfitHrCell = (itemData: SimpleResponse | null, hasError: boolean, isLoadingMarket: boolean) => {
    if (hasError) return <span className="text-red-500">Error</span>;
    if (isLoadingMarket && !itemData) return <span className="text-gray-500">Loading...</span>;

    if (itemData?.profit_hr) {
        const isPositive = itemData.profit_hr > 0;
        return (
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {itemData.profit_hr.toLocaleString()}
            </span>
        );
    }

    return <span className="text-gray-400">-</span>;
};


// Show Only Favorites
export const filterItemsByFavorites = (items: CraftingItem[], favorites: number[], showFavoritesOnly: boolean) => {
    if (!showFavoritesOnly) {
        return items; // Return all items in original order
    }
    // Filter to only show favorited items
    return items.filter(item => favorites.includes(item.id));
};