import {fetchCraftingMethods} from "@/app/lib/data";


export default async function CraftingTable() {
    const craftingMethods = await fetchCraftingMethods();

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
                        {craftingMethods?.map((method) => (
                            <tr
                                key={method.id}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                            >
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.lvl}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.product}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.exp}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.exp_rate}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.required_materials}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.cost}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.price}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.profit}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    {method.profit_rate}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}