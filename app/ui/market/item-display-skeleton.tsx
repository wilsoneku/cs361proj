// Skeleton component
export default function ItemDisplaySkeleton() {
    return (
        <div className="bg-slate-50 p-6 rounded-lg w-full max-w-4xl mx-auto border border-slate-200">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-6 border-b border-slate-300 pb-4">
                <div className="flex">
                    <img
                        className="w-9 h-9 mr-2 rounded border border-slate-300"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-end">
                            <span className="text-slate-500 text-sm mb-1 ml-2">(Item ID: ...)</span>
                        </h1>
                    </div>
                </div>

                {/* Top Navigation Buttons */}
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors"
                    >
                        Wiki
                    </button>
                    <button
                        className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors"
                    >
                        GEDB
                    </button>
                    <button className="bg-slate-600 hover:bg-slate-700 text-slate-50 px-4 py-2 rounded text-sm transition-colors">
                        ♥
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Price Information */}
                <div className="space-y-4">
                    {/* Buy Price */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Buy price:
                                    <span className="text-slate-700 font-bold">
                                        ... gp
                                    </span>
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Last trade: ...
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sell Price */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center mb-2">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    Sell price:
                                    <span className="text-slate-600 font-bold">
                                        ... gp
                                    </span>
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Last trade: ...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - Trading Stats */}
                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-800 font-semibold mb-1">Buy limit:</span>
                            <span className="text-slate-600">
                                ...
                            </span>
                        </div>
                        <div>
                            <h3 className="text-slate-800 font-semibold mb-1">Daily volume:</h3>
                            <p className="text-slate-600 text-sm">Data not available</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-800">Margin:</span>
                                <span className="text-slate-600 font-semibold">
                                    ... gp
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Potential profit:</span>
                                <span className="text-slate-600 font-semibold">
                                     ... gp
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Item Details */}
                <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-slate-800">High alch:</span>
                                <span className="text-slate-600">
                                    ...
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Low alch:</span>
                                <span className="text-slate-600">
                                    ...
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-800">Members:</span>
                                <span className="text-slate-600">
                                    ...
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-800">Examine Text:</span>
                                <p className="text-slate-600 text-sm mt-1">
                                    ...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
