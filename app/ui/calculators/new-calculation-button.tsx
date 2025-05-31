'use client'
import {CreateCalculation} from "@/app/ui/calculators/create-calculation";
import {useState} from "react";

export default function NewCalculationButton() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Create New Calculation
            </button>

            <CreateCalculation
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </div>
    );
}