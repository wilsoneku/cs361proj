import React from 'react';
import MarketSearch from "@/app/ui/market/market-search";

export default function Page() {
    return(
        <div className="flex flex-col items-center justify-center gap-12 mt-4">
            <h2 className="text-4xl font-bold leading-tight">
                Market
            </h2>

            <div style={{ padding: 40 }}>
                <h1>Item Search</h1>
                <MarketSearch />
            </div>

        </div>
    );
}