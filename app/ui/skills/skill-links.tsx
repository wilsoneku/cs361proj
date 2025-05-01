import Link from "next/link";

const links1 = [
    { name: 'combat', href: 'skills/combat'},
    { name: 'prayer', href: 'skills/prayer'},
    { name: 'magic', href: 'skills/magic'},
    { name: 'construction', href: 'skills/construction'},
];

const links2 = [
    { name: 'herbalore', href: 'skills/herbalore'},
    { name: 'crafting', href: 'skills/crafting'},
    { name: 'fletching', href: 'skills/fletching'},

];

const links3 = [
    { name: 'smithing', href: 'skills/smithing'},
    { name: 'cooking', href: 'skills/cooking'},
    { name: 'farming', href: 'skills/farming'},
];

export function SkillLinks1() {
    return (
        <>
            {links1.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                    >
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}

export function SkillLinks2() {
    return (
        <>
            {links2.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                    >
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}

export function SkillLinks3() {
    return (
        <>
            {links3.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
                    >
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}

