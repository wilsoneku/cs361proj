'use client'

import React, {useEffect, useState} from "react";
import {getSavedCalculations} from "@/app/ui/calculators/calculator-actions";
import {DeleteCalculation} from "@/app/ui/calculators/delete-calculation";

interface EnrichedCalculation {
    id: number;
    inputs_detailed: Record<string, any>;
    outputs_detailed: Record<string, any>;
    total_input_cost: number;
    total_output_value: number;
    profit: number;
}

export default function DisplayCalculations() {
    const [items, setItems] = useState<EnrichedCalculation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [favorites, setFavorites] = useState<number[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    async function loadCalculations() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getSavedCalculations();
            if (response && response.status === 'success') {
                setItems(response.data);
            }
        } catch (err) {
            setError('Failed to load saved calculations');
            console.error('Error loading calculations:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCalculations()
    }, []);

    const handleDeleteSuccess = () => {
        // Reload the calculations after successful deletion
        loadCalculations();
    };

    // Filter favorites
    const displayItems = showOnlyFavorites
        ? items.filter(item => favorites.includes(item.id))
        : items;


    const getProfitColor = (profit: number) => {
        if (profit > 0) return 'text-green-600';
        if (profit < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading saved calculations...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
            <div className="flex flex-wrap flex-shrink-0 justify-center items-start gap-4">
                {displayItems.map((item) => (
                    <div
                        key={`calculation-${item.id}`}
                        className="flex-shrink-0 w-52 min-w-52 border border-gray-200 rounded-lg shadow-md">
                        {/* Card Header */}
                        <div className="flex flex-row justify-between items-center
                                        bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg"
                        >
                            <div className="flex flex-col justify-start items-start">
                                <h3 className="text-md text-gray-900">
                                    {Object.values(item.outputs_detailed)[0]?.name}

                                </h3>
                                <p className="text-xs text-gray-500">
                                    calcID:{item.id}
                                </p>
                            </div>
                            <DeleteCalculation
                                calculationId={item.id.toString()}
                                onDeleteSuccess={handleDeleteSuccess}
                            />
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-4">
                            {/* Inputs Section */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                                    Required Items
                                </h4>
                                <div className="space-y-1">
                                    {Object.entries(item.inputs_detailed).map(([itemId, itemData], index) => (
                                        <div
                                            key={`input-${itemId}`}
                                            className="group relative cursor-help"
                                        >
                                            <div className="text-sm text-gray-600">
                                                <span>{itemData.quantity}x {itemData.name}</span>
                                            </div>

                                            {/* HOVER Tooltip */}
                                            <div
                                                className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100
                                                transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-lg
                                                px-3 py-2 shadow-lg -top-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                                            >
                                                <div className="space-y-1">
                                                    <div>ID: {itemId}</div>
                                                    <div>Price: {itemData.unit_price?.toLocaleString()} gp ea.</div>
                                                </div>
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
    );



}