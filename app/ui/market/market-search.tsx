'use client'

import React, {useState, useEffect, ChangeEvent, useActionState, useRef} from 'react';
import {submitItemID} from "@/app/ui/market/item-search-actions";
import {ItemInfo} from "@/app/market/page";
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
}

export default function MarketSearch({ onSearchResults, initialItemId }: MarketSearchProps) {
    const [data, setData] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ name: string; id: number } | null>(null);
    const [isUserSearch, setIsUserSearch] = useState(false);

    const initialData: SearchData = { itemID: null, info: null };
    const [state, formAction] = useActionState(
        submitItemID as (prevState: SearchData, formData: FormData) => Promise<SearchData>,
        initialData
    );

    const formRef = useRef<HTMLFormElement>(null);

    // on page load
    useEffect(() => {
        fetch('/name_id_map.json')
            .then(res => res.json())
            .then(setData);
    }, []);

    // Handle initial item ID from URL
    useEffect(() => {
        if (initialItemId && data && Object.keys(data).length > 0) {
            const itemName = Object.keys(data).find(name => data[name].toString() === initialItemId);
            if (itemName) {
                setQuery(itemName);
                setSelected({ name: itemName, id: parseInt(initialItemId) });

                // Auto-submit the form for the URL item
                setTimeout(() => {
                    formRef.current?.requestSubmit();
                }, 100);
            }
        } else if (!initialItemId) {
            // Clear search when no item ID in URL
            setQuery('');
            setSelected(null);
            setSuggestions([]);
        }
    }, [initialItemId, data]);

    // Combine the two useEffect hooks into one with proper conditions
    useEffect(() => {
        if (state.info || state.error) {
            onSearchResults(state.info, state.itemID);
            // Only clear if user is NOT actively typing and it's not a URL navigation
            if (state.info && !state.error && isUserSearch) {
                setTimeout(() => {
                    setQuery('');
                    setSelected(null);
                    setSuggestions([]);
                    setIsUserSearch(false);
                }, 800);
            }
        }
    }, [state.info, state.error, state.itemID]);

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

    const handleSelect = (name: string) => {
        setQuery(name);
        setSelected({ name, id: data[name] });
        setSuggestions([]);
        setIsUserSearch(true);
        setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 0);
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
            </Form>
        </div>
    );
};