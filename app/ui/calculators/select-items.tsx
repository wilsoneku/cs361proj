'use client'

import React, {ChangeEvent, useEffect, useState} from "react";
import {uploadToDatabase} from "@/app/ui/calculators/calculator-actions";

type NameIdMap = Record<string, number>;

interface SelectedItem {
    name: string;
    id: number;
    quantity: number;
    type: 'input' | 'output';
}

interface JSONOutput {
    inputs: Record<string, number>;
    outputs: Record<string, number>;
}

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCalculation({ isOpen, onClose }: PopupProps) {
    const [data, setData] = useState<NameIdMap>({});
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [currentSelectionType, setCurrentSelectionType] = useState<'input' | 'output'>('input');
    const [generatedJSON, setGeneratedJSON] = useState<JSONOutput | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>('');

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
        setSuggestions(matches.slice(0, 10));
    };

    const handleSelect = (name: string) => {
        const id = data[name];
        const newItem: SelectedItem = {
            name,
            id,
            quantity: 1,
            type: currentSelectionType
        };

        const existingIndex = selectedItems.findIndex(
            item => item.id === id && item.type === currentSelectionType
        );

        if (existingIndex === -1) {
            setSelectedItems([...selectedItems, newItem]);
        }

        setQuery('');
        setSuggestions([]);
    };

    const updateQuantity = (index: number, quantity: number) => {
        const updated = [...selectedItems];
        updated[index].quantity = Math.max(1, quantity);
        setSelectedItems(updated);
    };

    const removeItem = (index: number) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    const uploadToBackend = async (jsonData: JSONOutput) => {
        setIsUploading(true);
        setUploadStatus('');

        try {
            const response = await fetch('http://localhost:8004/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)
            });

            if (response.ok) {
                console.log("generated JSON: ", jsonData)
                const result = await response.json();
                setUploadStatus('✅ Successfully uploaded calculation!');
                console.log('Upload successful:', result);

                // Clear form after successful upload
                setTimeout(() => {
                    setSelectedItems([]);
                    setGeneratedJSON(null);
                    setUploadStatus('');
                    onClose();
                }, 2000);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('❌ Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const generateAndUploadJSON = async () => {
        const inputs: Record<string, number> = {};
        const outputs: Record<string, number> = {};

        selectedItems.forEach(item => {
            if (item.type === 'input') {
                inputs[item.id.toString()] = item.quantity;
            } else {
                outputs[item.id.toString()] = item.quantity;
            }
        });

        const result = { inputs, outputs };
        setGeneratedJSON(result);

        // Automatically upload to backend
        await uploadToDatabase(result);
    };

    const inputItems = selectedItems.filter(item => item.type === 'input');
    const outputItems = selectedItems.filter(item => item.type === 'output');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-6">Create New Calculation</h2>

                {/* Selection Type Toggle */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Ingredients Box */}
                        <div
                            onClick={() => setCurrentSelectionType('input')}
                            className={`
                                p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center
                                ${currentSelectionType === 'input'
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                            }`}>
                            <div className="flex items-center justify-center mb-2">
                                <input
                                    type="radio"
                                    value="input"
                                    checked={currentSelectionType === 'input'}
                                    onChange={(e) => setCurrentSelectionType(e.target.value as 'input')}
                                    className="mr-3 w-4 h-4"
                                    readOnly
                                />
                                <span className={`text-lg font-semibold ${
                                    currentSelectionType === 'input' ? 'text-blue-700' : 'text-gray-700'
                                }`}>
          Ingredients
        </span>
                            </div>
                            <p className={`text-sm ${
                                currentSelectionType === 'input' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                                Items required for crafting
                            </p>
                        </div>

                        {/* End Product Box */}
                        <div
                            onClick={() => setCurrentSelectionType('output')}
                            className={`
                                p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center
                                ${currentSelectionType === 'output'
                                ? 'border-green-500 bg-green-50 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                            }
      `}
                        >
                            <div className="flex items-center justify-center mb-2">
                                <input
                                    type="radio"
                                    value="output"
                                    checked={currentSelectionType === 'output'}
                                    onChange={(e) => setCurrentSelectionType(e.target.value as 'output')}
                                    className="mr-3 w-4 h-4"
                                    readOnly
                                />
                                <span className={`text-lg font-semibold ${
                                    currentSelectionType === 'output' ? 'text-green-700' : 'text-gray-700'
                                }`}>
          End Product
        </span>
                            </div>
                            <p className={`text-sm ${
                                currentSelectionType === 'output' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                                Items produced from crafting
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={`Search items to add to ${currentSelectionType}s...`}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />

                    {suggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                            {suggestions.map(name => (
                                <div
                                    key={name}
                                    onClick={() => handleSelect(name)}
                                    className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                                >
                                    {name} (ID: {data[name]})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Items Display */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Input Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Input Items ({inputItems.length})</h3>
                        <div className="space-y-2">
                            {inputItems.map((item, index) => (
                                <div key={`input-${index}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-sm text-gray-600">ID: {item.id}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(
                                            selectedItems.findIndex(si => si === item),
                                            parseInt(e.target.value) || 1
                                        )}
                                        className="w-16 px-2 py-1 border rounded"
                                    />
                                    <button
                                        onClick={() => removeItem(selectedItems.findIndex(si => si === item))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Output Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Output Items ({outputItems.length})</h3>
                        <div className="space-y-2">
                            {outputItems.map((item, index) => (
                                <div key={`output-${index}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-sm text-gray-600">ID: {item.id}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(
                                            selectedItems.findIndex(si => si === item),
                                            parseInt(e.target.value) || 1
                                        )}
                                        className="w-16 px-2 py-1 border rounded"
                                    />
                                    <button
                                        onClick={() => removeItem(selectedItems.findIndex(si => si === item))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upload Status */}
                {uploadStatus && (
                    <div className={`mb-4 p-3 rounded-lg ${uploadStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {uploadStatus}
                    </div>
                )}

                {/* Generate and Upload Button */}
                <div className="text-center mb-6">
                    <button
                        onClick={generateAndUploadJSON}
                        disabled={selectedItems.length === 0 || isUploading}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : 'Create & Upload Calculation'}
                    </button>
                </div>

                {/* Generated JSON Display */}
                {generatedJSON && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Generated JSON:</h3>
                        <pre className="bg-white p-4 rounded border overflow-auto text-sm">
              {JSON.stringify(generatedJSON, null, 2)}
            </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
