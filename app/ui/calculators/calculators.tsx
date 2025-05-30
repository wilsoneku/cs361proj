'use client'

import React, {useEffect, useState} from "react";
import {getSavedCalculations} from "@/app/ui/calculators/calculator-actions";

interface EnrichedCalculation {
    id: number;
    inputs_detailed: Record<string, any>;
    outputs_detailed: Record<string, any>;
    total_input_cost: number;
    total_output_value: number;
    profit: number;
}

export default function Calculators() {
    const [items, setItems] = useState<EnrichedCalculation[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSavedCalculations();
                if (response && response.status === 'success') {
                    setItems(response.data);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        void fetchData();
    }, []);

    // Filter favorites
    const displayItems = showOnlyFavorites
        ? items.filter(item => favorites.includes(item.id))
        : items;


    const renderDetailedItems = (itemsObject: Record<string, any>) => {
        return (
            <div className="ingredients-list">
                {Object.entries(itemsObject).map(([itemId, itemData]) => (
                    <div key={itemId} className="flex flex-col mb-2 p-2 border rounded">
                       <div className="flex flex-row">
                           <div className="font-medium">
                               {itemData.name} (ID: {itemId})
                           </div>
                       </div>
                        <div className="flex flex-row">

                            <div className="font-medium">
                                 {itemData.quantity} @ {itemData.unit_price?.toLocaleString()} gp ea.
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Total: {itemData.total_cost?.toLocaleString()} gp
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const getProfitColor = (profit: number) => {
        if (profit > 0) return 'text-green-600';
        if (profit < 0) return 'text-red-600';
        return 'text-gray-600';
    };


    if (loading) return <div className="p-4">Loading calculations...</div>;
    // if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Calculation Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayItems.map((item) => (
                    <div key={`calculation-${item.id}`} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow h-fit">
                        {/* Card Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="text-base font-semibold text-gray-900">
                                Calculation ID: {item.id}
                            </h3>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-4">
                            {/* Inputs Section */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 text-xs uppercase tracking-wide">Required Items</h4>
                                <div className="space-y-1">
                                    {Object.entries(item.inputs_detailed).map(([itemId, itemData], index) => (
                                        <div
                                            key={`input-${itemId}`}
                                            className="group relative cursor-help"
                                        >
                                            <div className="text-sm text-gray-600">
                                                <span>{itemData.quantity}x {itemData.name}</span>
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div>ID: {itemId}</div>
                                                    <div>Price: {itemData.unit_price?.toLocaleString()} gp each</div>
                                                    <div>Total: {itemData.total_cost?.toLocaleString()} gp</div>
                                                </div>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-right text-sm font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                                        Total: {item.total_input_cost?.toLocaleString()} gp
                                    </div>
                                </div>
                            </div>

                            {/* Outputs Section */}
                            <div className="space-y-2 border-t pt-4">
                                <h4 className="font-medium text-gray-700 text-xs uppercase tracking-wide">Produced Items</h4>
                                <div className="space-y-1">
                                    {Object.entries(item.outputs_detailed).map(([itemId, itemData], index) => (
                                        <div
                                            key={`output-${itemId}`}
                                            className="group relative cursor-help"
                                        >
                                            <div className="text-sm text-gray-600">
                                                <span>{itemData.quantity}x {itemData.name}</span>
                                            </div>

                                            {/* Tooltip */}
                                            <div className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div>ID: {itemId}</div>
                                                    <div>Price: {itemData.unit_price?.toLocaleString()} gp each</div>
                                                    <div>Total: {itemData.total_cost?.toLocaleString()} gp</div>
                                                </div>
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-right text-sm font-semibold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                                        Total: {item.total_output_value?.toLocaleString()} gp
                                    </div>
                                </div>
                            </div>

                            {/* Profit Analysis Section */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Profit/Loss:</span>
                                    <span className={`font-bold text-lg ${getProfitColor(item.profit)}`}>
                                        {item.profit?.toLocaleString()} gp
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );



}