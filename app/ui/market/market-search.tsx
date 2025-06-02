'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {MarketSearchProps} from "@/app/lib/types";

type NameIdMap = Record<string, number>;

export default function MarketSearch({
                                         onItemSelected,
                                         isLoading
}: MarketSearchProps) {
    const [nameIdMap, setNameIdMap] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ name: string; id: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    // Handle selected item from suggestions
    const handleSelect = useCallback((name: string) => {
        if (isLoading) {
            return;
        }

        const selectedItem = { name, id: nameIdMap[name] };

        setQuery(name);
        setSelected(selectedItem);
        setSuggestions([]);
        setError(null);

        // Pass selected item ID back to parent
        onItemSelected(selectedItem.id.toString());

    }, [nameIdMap, isLoading]);

    // Clear search bar when input is selected
    const handleInputFocus = useCallback(() => {
        setQuery('');
        setSelected(null);
        setSuggestions([]);
        setError(null);
;
    }, []);

    // Form submit handler - just prevents default behavior
    const formAction = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (selected) {
            onItemSelected(selected.id.toString());
        }
    }, [selected, onItemSelected]);

    return (
        <div className="w-96 mx-auto">
            <form
                onSubmit={formAction}
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

            </form>
        </div>
    );
};