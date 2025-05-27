// components/PriceCell.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { fetchItemPrice } from '@/app/ui/market/item-search-actions';

interface PriceCellProps {
    itemId: number;
    staticPrice?: number; // fallback to static price
}

const PriceCell: React.FC<PriceCellProps> = ({ itemId, staticPrice }) => {
    const [priceData, setPriceData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await fetchItemPrice(itemId);
                setPriceData(result);
            } catch (err) {
                setError('Failed to fetch price');
                console.error('Price fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrice();
    }, [itemId]);

    if (loading) {
        return <span className="text-gray-500">Loading...</span>;
    }

    if (error || !priceData) {
        return <span className="text-gray-600">{staticPrice?.toLocaleString() || 'N/A'}</span>;
    }

    return (
        <div className="flex flex-col">
            <span className="font-medium text-green-600">
                {priceData.high?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">
                Low: {priceData.low?.toLocaleString()}
            </span>
        </div>
    );
};

export default PriceCell;
