export default async function CraftingTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                Lvl
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Product
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Exp
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Exp/hr
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium w-56">
                                Required Materials
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Cost
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Price
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Profit
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Profit/hr
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}