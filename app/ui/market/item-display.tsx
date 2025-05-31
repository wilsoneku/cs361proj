// item-display.tsx
'use client'

import React from 'react';
import {ItemInfo} from "@/app/lib/types";

interface ItemDisplayProps {
    itemInfo: ItemInfo | null;
    itemId: string | null;
}

interface TimeAgoOptions {
    includeSeconds?: boolean;
    shortFormat?: boolean;
}

function formatTimeAgo(unixTimestamp: number, options: TimeAgoOptions = {}): string {
    const { includeSeconds = true, shortFormat = false } = options;

    // Handle both seconds and milliseconds timestamps
    const timestampMs = unixTimestamp < 10000000000
        ? unixTimestamp * 1000  // Convert seconds to milliseconds
        : unixTimestamp;        // Already in milliseconds

    const now = Date.now();
    const diffMs = now - timestampMs;

    if (diffMs < 0) {
        return shortFormat ? 'now' : 'just now';
    }

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const formatUnit = (value: number, unit: string): string => {
        if (shortFormat) {
            return `${value}${unit.charAt(0)}`;
        }
        return value === 1 ? `1 ${unit} ago` : `${value} ${unit}s ago`;
    };

    if (years > 0) return formatUnit(years, 'year');
    if (months > 0) return formatUnit(months, 'month');
    if (days > 0) return formatUnit(days, 'day');
    if (hours > 0) return formatUnit(hours, 'hour');
    if (minutes > 0) return formatUnit(minutes, 'minute');
    if (includeSeconds && seconds > 0) return formatUnit(seconds, 'second');

    return shortFormat ? 'now' : 'just now';
}

export default function ItemDisplay({ itemInfo, itemId }: ItemDisplayProps) {
    if (!itemInfo) {
        return
    }

    const item = itemInfo.details.item;
    const convertedName = item.name.replace(/ /g, '_');

    const handleWikiClick = () => {
        if (itemId) {
            const wikiUrl = `https://oldschool.runescape.wiki/w/${convertedName}`;
            window.open(wikiUrl, '_blank');
        }
    };

    const handleGedbClick = () => {
        if (itemId) {
            const gedbUrl = `https://secure.runescape.com/m=itemdb_oldschool/a=12/Ashes/viewitem?obj=${itemId}`;
            window.open(gedbUrl, '_blank');
        }
    };

    return (
        <div className="bg-slate-50 p-6 rounded-lg w-full max-w-4xl mx-auto border border-slate-200">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-6 border-b border-slate-300 pb-4">
                <div className="flex">
                    <img
                        src={item.icon_large}
                        alt={item.name}
                        className="w-9 h-9 mr-2 rounded border border-slate-300"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-end">
                            {item.name}
                            <span className="text-slate-500 text-sm mb-1 ml-2">(Item ID: {itemId})</span>
                        </h1>
                    </div>
                </div>

                {/* Top Navigation Buttons */}
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors"
                        onClick={handleWikiClick}
                    >
                        Wiki
                    </button>
                    <button
                        className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors"
                        onClick={handleGedbClick}
                    >
                        GEDB
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors">
                        ♥
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Price Information */}
                <div className="space-y-4">
                    {/* Buy Price */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Buy price: <span className="text-slate-700 font-bold">{itemInfo.high?.toLocaleString()} gp</span>
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Last trade: {formatTimeAgo(itemInfo.highTime)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sell Price */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Sell price: <span className="text-slate-600 font-bold">{itemInfo.low?.toLocaleString()} gp</span>
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Last trade: {formatTimeAgo(itemInfo.lowTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Trading Stats */}
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-800 font-semibold mb-1">Buy limit:</span>
                            <span className="text-slate-600">
                                {itemInfo.buylimit ? itemInfo.buylimit.toLocaleString().split('.')[0] : 'Unknown'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-slate-800 font-semibold mb-1">Daily volume:</h3>
                            <p className="text-slate-600 text-sm">Data not available</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-800">Margin:</span>
                                <span className="text-slate-600 font-semibold">
                                    {itemInfo.high && itemInfo.low ?
                                        (itemInfo.high - itemInfo.low).toLocaleString() : 'N/A'} gp
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Potential profit:</span>
                                <span className="text-slate-600 font-semibold">
                                     'N/A' gp
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Item Details */}
                <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-800">High alch:</span>
                                <span className="text-slate-600">
                                    {itemInfo.buylimit ? itemInfo.highalch?.toLocaleString().split('.')[0] : 'Unknown'} gp
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Low alch:</span>
                                <span className="text-slate-600">
                                    {itemInfo.buylimit ? itemInfo.lowalch?.toLocaleString().split('.')[0] : 'Unknown'} gp
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Members:</span>
                                {item.members === "true" ? (
                                    <span className="flex items-center text-slate-700 text-sm font-medium">
                                        ✅ Members
                                    </span>
                                ) : (
                                    <span className="text-slate-600 text-sm font-medium">
                                        ❌ Free-to-Play
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-slate-800">Examine Text:</span>
                                <p className="text-slate-600 text-sm mt-1">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
