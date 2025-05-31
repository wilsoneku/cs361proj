'use client'
import { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export const PriceWarning = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <div
                className={`
          absolute right-6 top-1/2 -translate-y-1/2
          bg-amber-50 border border-amber-200 rounded-lg shadow-lg
          p-3 text-sm text-amber-700
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-100 w-64 translate-x-0' : 'opacity-0 w-0 translate-x-4 pointer-events-none'}
        `}
            >
                <p className="whitespace-normal">
                    WARNING: Displayed prices are based off of publicly available API data.
                    Always verify the live prices in-game before making any large purchases decisions.
                </p>
            </div>

            <div className="text-amber-500 cursor-help">
                <ExclamationTriangleIcon className="h-5 w-5" />
            </div>

        </div>
    );
};
