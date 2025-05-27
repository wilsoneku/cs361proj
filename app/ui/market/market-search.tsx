'use client'
import React, {useState, useEffect, ChangeEvent, useActionState, useRef} from 'react';
import {submitItemID} from "@/app/ui/market/item-search-actions";
import Form from 'next/form'

type NameIdMap = Record<string, number>;
type SearchData = {
    itemID: string | null;
    info: ItemInfo | null;
    error?: string;
};

interface ItemSearchProps {
    itemID: string;
}
interface ItemInfo {
    itemid: number,
    high: number,
    highTime: number,
    low: number,
    lowTime: number
}


const MarketSearch: React.FC = () => {
    const [data, setData] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selected, setSelected] = useState<{ name: string; id: number } | null>(null);

    const initialData: SearchData = { itemID: null, info: null };
    const [state, formAction] = useActionState(
        submitItemID as (prevState: SearchData, formData: FormData) => Promise<SearchData>,
        initialData
    );

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        fetch('/name_id_map.json')
            .then(res => res.json())
            .then(setData);
    }, []);

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
        setSuggestions(matches.slice(0, 10)); // Limit to 10 suggestions
    };

    const handleSelect = (name: string) => {
        setQuery(name);
        setSelected({ name, id: data[name] });
        setSuggestions([]);
        // Auto-submit the form
        setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 0);
    };

    return (
        <Form
            action={formAction}
            ref={formRef}
        >
        <div style={{ position: 'relative', width: 300 }}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search item name..."
                style={{ width: '100%', padding: '8px' }}
            />
            {suggestions.length > 0 && (
                <ul style={{
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #ccc',
                    zIndex: 30,
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    maxHeight: 200,
                    overflowY: 'auto'
                }}>
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

            {selected && (
                <div style={{ marginTop: 8 }}>
                    ID: {selected.id}
                </div>
            )}

            {state.error && (
                <div className="text-red-500">{state.error}</div>
            )}
            {state.info && (
                <div>
                    <p>High: {state.info.high}</p>
                    <p>High Time: {state.info.highTime}</p>
                    <p>Low: {state.info.low}</p>
                    <p>Low Time: {state.info.lowTime}</p>
                </div>
            )}
        </div>
        </Form>
    );
};

export default MarketSearch;
