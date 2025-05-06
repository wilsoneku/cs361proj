'use client'
import {getCraftingMethods} from "@/app/ui/skills/tables/get-crafting-methods";
import {useState, useEffect} from "react";
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {PriceWarning} from "@/app/ui/skills/price-warning";

interface CraftingItem {
    id: number;
    lvl: number;
    product: string;
    exp: number;
    exp_rate: number;
    required_materials: string;
    cost: number;
    price: number;
    profit: number;
    profit_rate: number;
}

const loadingTable = (
    <div className="">
        <div className="mb-4 flex justify-between items-center">
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
                <StarIcon className="h-5 w-5" />
                Show Favorites
            </button>

        </div>

        <div className="flow-root min-w-full align-middle rounded-lg bg-gray-50 p-2">
            <table className="text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                <tr className="items-center justify-center">
                    <th scope="col" className="px-4 py-5 font-medium pl-6">
                        Fav
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium pl-6">
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
                <tbody className="divide-y divide-gray-200">
                    <tr
                        className="w-full border-b py-3 text-sm last-of-type:border-none"
                    >
                        <td className="px-4 py-2">
                                    <StarIcon className="h-5 w-5" />
                        </td>
                        <td className="px-4 py-2">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
)

export default function CraftingTable() {
    const [items, setItems] = useState<CraftingItem[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCraftingMethods();
                setItems(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('craftingFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        localStorage.setItem('craftingFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const displayItems = showOnlyFavorites
        ? items.filter(item => favorites.includes(item.id))
        : items;

    if (loading) {
        return loadingTable
    }

    return (
        <div className="">
            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                    {showOnlyFavorites ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                    ) : (
                        <StarIcon className="h-5 w-5" />
                    )}
                    {showOnlyFavorites ? 'Show All' : 'Show Favorites'}
                </button>
                <PriceWarning />
            </div>

            <div className="flow-root min-w-full align-middle rounded-lg bg-gray-50 p-2">
                <table className="text-gray-900">
                    <thead className="rounded-lg text-left text-sm font-normal">
                        <tr className="items-center justify-center">
                            <th scope="col" className="px-4 py-5 font-medium pl-6">
                                Fav
                            </th>
                            <th scope="col" className="px-4 py-5 font-medium pl-6">
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
                    <tbody className="divide-y divide-gray-200">
                    {displayItems.map((item) => (
                        <tr
                            key={item.id}
                            className="w-full border-b py-3 text-sm last-of-type:border-none"
                        >
                        <td className="px-4 py-2">
                                <button
                                    onClick={() => toggleFavorite(item.id)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    {favorites.includes(item.id) ? (
                                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                                    ) : (
                                        <StarIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </td>
                            <td className="px-4 py-2">{item.lvl}</td>
                            <td className="px-4 py-2">{item.product}</td>
                            <td className="px-4 py-2">{item.exp}</td>
                            <td className="px-4 py-2">{item.exp_rate.toLocaleString()}</td>
                            <td className="px-4 py-2">{item.required_materials}</td>
                            <td className="px-4 py-2">{item.cost.toLocaleString()}</td>
                            <td className="px-4 py-2">{item.price.toLocaleString()}</td>
                            <td className="px-4 py-2">{item.profit.toLocaleString()}</td>
                            <td className="px-4 py-2">{item.profit_rate.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// export default async function CraftingTable() {
//     // const craftingMethods = await fetchCraftingMethods();
//     const [items, setItems] = useState<CraftingItem[]>([]);
//     const [favorites, setFavorites] = useState<number[]>([]);
//     const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
//     const [loading, setLoading] = useState(true);
//
//     return (
//         <div className="mt-6 flow-root">
//             <div className="inline-block min-w-full align-middle">
//                 <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
//                     <table className="hidden min-w-full text-gray-900 md:table">
//                         <thead className="rounded-lg text-left text-sm font-normal">
//                         <tr>
//                             <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
//                                 Lvl
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Product
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Exp
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Exp/hr
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium w-56">
//                                 Required Materials
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Cost
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Price
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Profit
//                             </th>
//                             <th scope="col" className="px-3 py-5 font-medium">
//                                 Profit/hr
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="bg-white">
//                         {craftingMethods?.map((method) => (
//                             <tr
//                                 key={method.id}
//                                 className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
//                             >
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.lvl}
//                                 </td>
//
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.product}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.exp}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.exp_rate}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.required_materials}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.cost}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.price}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.profit}
//                                 </td>
//                                 <td className="whitespace-nowrap px-3 py-3">
//                                     {method.profit_rate}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }