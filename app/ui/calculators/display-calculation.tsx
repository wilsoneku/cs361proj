import React from "react";

interface CustomCalculation {
    id: number;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
}

interface DisplayCalculationProps {
    items?: CustomCalculation[]
}

export default function DisplayCalculation(displayItems: DisplayCalculationProps) {
    return (
        <div>
            blank
        </div>
    )
}