'use client'

import React, {useState, useEffect, ChangeEvent, useActionState, useRef} from 'react';
import {fetchItemID} from "@/app/ui/market/market-search-actions";
import {ItemInfo} from "@/app/lib/types";
import Form from 'next/form'

type NameIdMap = Record<string, number>;

type SearchData = {
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
};

interface MarketSearchProps {
    onSearchResults: (results: ItemInfo | null, itemId: string | null) => void;
    initialItemId?: string | null;
    isLoading?: boolean;
}

export default function MarketSearch({ onSearchResults, initialItemId, isLoading = false }: MarketSearchProps) {
    const [data, setData] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ name: string; id: number } | null>(null);
    const [isUserSearch, setIsUserSearch] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialData: SearchData = { itemID: null, info: null };
    const [state, formAction] = useActionState(
        fetchItemID as (prevState: SearchData, formData: FormData) => Promise<SearchData>,
        initialData
    );

    const formRef = useRef<HTMLFormElement>(null);
    const hasProcessedInitialItem = useRef(false);

    // on page load fetch item data once
    useEffect(() => {
        if (hasInitialized) return;

        fetch('/name_id_map.json')
            .then(res => res.json())
            .then(mapData => {
                setData(mapData);
                setHasInitialized(true);
            })
            .catch(err => {
                console.error('Failed to load item data:', err);
                setHasInitialized(true);
            });
    }, [hasInitialized]);

    // Handle initial item ID from URL
    useEffect(() => {
        if (
            hasInitialized &&
            initialItemId &&
            data &&
            Object.keys(data).length > 0 &&
            !hasProcessedInitialItem.current &&
            !isSubmitting &&
            !isLoading
        ) {
            const itemName = Object.keys(data).find(name => data[name].toString() === initialItemId);
            if (itemName) {
                setQuery(itemName);
                setSelected({ name: itemName, id: parseInt(initialItemId) });
                hasProcessedInitialItem.current = true;
            }
        }
    }, [initialItemId, data, hasInitialized, isSubmitting, isLoading]);

    // Handle state updates
    useEffect(() => {
        if (state.info || state.error) {
            setIsSubmitting(false);

            // Only notify parent if it was a user-initiated search
            if (isUserSearch || !hasProcessedInitialItem.current) {
                onSearchResults(state.info, state.itemID);
            }

            // Only clear if it was a user-initiated search and was successful
            if (state.info && !state.error && isUserSearch) {
                setTimeout(() => {
                    setQuery('');
                    setSelected(null);
                    setSuggestions([]);
                    setIsUserSearch(false);
                }, 800);
            }
        }
    }, [state.info, state.error, state.itemID, onSearchResults, isUserSearch]);


    // Suggestion / autocomplete handler
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length === 0) {
            setSuggestions([]);
            return;
        }

        const matches = Object.keys(data).filter(name =>
            name.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matches.slice(0, 10));
    };

    // Prevent submissions (after item is selected)
    const handleSelect = (name: string) => {
        // Prevent submission if already submitting or if parent is loading
        if (isSubmitting || isLoading) return;

        setQuery(name);
        setSelected({ name, id: data[name] });
        setSuggestions([]);
        setIsUserSearch(true);
        setIsSubmitting(true);

        // Use requestAnimationFrame to ensure we're not in the middle of a render
        requestAnimationFrame(() => {
            if (formRef.current) {
                formRef.current.requestSubmit();
            }
        });
    };


    return (
        <div className="w-96 mx-auto">
            <Form
                action={formAction}
                ref={formRef}
                className="relative"
            >
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search in the Grand Exchange..."
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={isLoading || isSubmitting}
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

                    {state.error && (
                        <div className="text-red-500">{state.error}</div>
                    )}

                    {(isLoading || isSubmitting) && (
                        <div className="text-blue-500 mt-2">Loading item data...</div>
                    )}

            </Form>
        </div>
    );
};