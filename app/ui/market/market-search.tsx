'use client'

import React, {useState, useEffect, ChangeEvent, useActionState, useRef, useCallback} from 'react';
import {fetchItemID} from "@/app/ui/market/market-search-actions";
import {ItemInfo, SearchData} from "@/app/lib/types";
import Form from 'next/form'

type NameIdMap = Record<string, number>;

interface MarketSearchProps {
    onSearchResults: (results: ItemInfo | null, itemId: string | null) => void;
    initialItemId?: string | null;
    isLoading?: boolean;
    onLoadingChange?: (isLoading: boolean) => void;
}

export default function MarketSearch({
                                         onSearchResults,
                                         initialItemId,
                                         isLoading = false,
                                         onLoadingChange
}: MarketSearchProps) {
    const [nameIdMap, setNameIdMap] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ name: string; id: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formRef = useRef<HTMLFormElement>(null);
    const hasInitialized = useRef(false);

    // Load name-ID mapping on mount
    useEffect(() => {
        if (hasInitialized.current) return;

        fetch('/name_id_map.json')
            .then(res => res.json())
            .then(setNameIdMap)
            .catch(err => console.error('Failed to load item data:', err))
            .finally(() => { hasInitialized.current = true; });
    }, []);

    // Handle initial item ID from URL
    useEffect(() => {
        if (!hasInitialized.current || !initialItemId || !nameIdMap || Object.keys(nameIdMap).length === 0) {
            return;
        }

        const itemName = Object.keys(nameIdMap).find(name =>
            nameIdMap[name].toString() === initialItemId
        );

        if (itemName) {
            setQuery(itemName);
            setSelected({ name: itemName, id: parseInt(initialItemId) });
        }
    }, [initialItemId, nameIdMap]);

    // Handle input changes and generate suggestions
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length === 0) {
            setSuggestions([]);
            return;
        }

        const matches = Object.keys(nameIdMap).filter(name =>
            name.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestions(matches.slice(0, 10));
    }, [nameIdMap]);

    // Handle suggestion selection
    const handleSelect = useCallback((name: string) => {
        if (isLoading) {
            return;
        }

        setQuery(name);
        setSelected({ name, id: nameIdMap[name] });
        setSuggestions([]);
        setError(null);
        onLoadingChange?.(true);

        setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 100);
    }, [nameIdMap, isLoading, onLoadingChange]);

    // Form action handler
    const handleFormAction = useCallback(async (formData: FormData) => {
        if (!selected?.id) {
            setError('No item selected');
            onLoadingChange?.(false);
            return;
        }

        try {
            setError(null);

            // Actually await the API call result
            const result = await fetchItemID({} as SearchData, formData);

            if (result.error) {
                setError(result.error);
                onSearchResults(null, null);
            } else {
                onSearchResults(result.info, result.itemID);
            }
        } catch (err) {
            setError('Search failed. Please try again.');
            console.error('Search error:', err);
        } finally {
            onLoadingChange?.(false);
        }
    }, [onSearchResults, selected]);

    const handleInputFocus = useCallback(() => {
        setQuery('');
        setSelected(null);
        setSuggestions([]);
        setError(null);
;
    }, [onSearchResults]);

    return (
        <div className="w-96 mx-auto">
            <Form
                action={handleFormAction}
                ref={formRef}
                className="relative"
            >
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        placeholder="Search in the Grand Exchange..."
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 mt-1
                            bg-white border border-gray-300 rounded-lg shadow-lg
                            z-10 max-h-48 overflow-y-auto"
                            >
                                {suggestions.map(name => (
                                    <li
                                        key={name}
                                        onClick={() => handleSelect(name)}
                                        style={{
                                            padding: '8px',
                                            cursor: 'pointer',
                                            background: name === selected?.name ? '#f0f0f0' : 'white'
                                        }}
                                    >
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}

                    <input type="hidden" name="itemID" value={selected?.id ?? ''} />

                    {error && (
                        <div style={{ color: 'red', marginTop: '8px' }}>
                            {error}
                        </div>
                    )}

            </Form>
        </div>
    );
};