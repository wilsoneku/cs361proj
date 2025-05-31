'use client'
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

import {deleteCalculation} from "@/app/ui/calculators/calculator-actions";

interface DeleteButtonProps {
    calculationId: string;
    onDeleteSuccess?: () => void;
}

export function DeleteCalculation({ calculationId, onDeleteSuccess }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        // Confirm deletion
        if (!window.confirm(`Are you sure you want to delete calculation #${calculationId}? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        setError(null);
        try {
            const result = await deleteCalculation(calculationId);

            if (result.success) {
                // Call the callback function if it exists
                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
            } else {
                setError(result.error as string);
            }
        } catch (err) {
            setError('Failed to delete calculation. Please try again.');
            console.error('Error deleting calculation:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                aria-label="Delete calculation"
            >
                <TrashIcon className="h-5 w-5" />
            </button>

            {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
        </div>
    );
}