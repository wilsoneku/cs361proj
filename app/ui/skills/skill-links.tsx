import Link from "next/link";
import Image from "next/image";

const links1 = [
    { name: 'Prayer', href: 'skills/prayer', icon: '/icons/Prayer_icon.png'},
    { name: 'Magic', href: 'skills/magic', icon: '/icons/Magic_icon.png'},
    { name: 'Constru--ction', href: 'skills/construction', icon: '/icons/Construction_icon.png'},
];

const links2 = [
    { name: 'Herblore', href: 'skills/herbalore', icon: '/icons/Herblore_icon.png'},
    { name: 'Crafting', href: 'skills/crafting', icon: '/icons/Crafting_icon.png'},
    { name: 'Fletching', href: 'skills/fletching', icon: '/icons/Fletching_icon.png'},

];

const links3 = [
    { name: 'Smithing', href: 'skills/smithing', icon: '/icons/Smithing_icon.png'},
    { name: 'Cooking', href: 'skills/cooking', icon: '/icons/Cooking_icon.png'},
    { name: 'Farming', href: 'skills/farming', icon: '/icons/Farming_icon.png'},
];

const linkClass = "flex items-center justify-start gap-2 p-3 text-sm font-medium text-wrap"

export function SkillLinks1() {
    return (
        <>
            {links1.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={linkClass}
                    >
                        <Image
                            src="/buttons/button-2.png"
                            width={130}
                            height={80}
                            alt={"button background"}
                        />
                        <div className="flex flex-row flex-grow-0 -ml-[113px] gap-2">
                            <Image
                                src={link.icon}
                                width={25}
                                height={25}
                                alt={"icon"} />
                            <p className="w-[65px] break-words">{link.name}</p>
                        </div>
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
                        className={linkClass}
                    >
                        <Image
                            src="/buttons/button-2.png"
                            width={130}
                            height={80}
                            alt={"button background"}
                        />
                        <div className="flex flex-row flex-grow-0 -ml-[113px] gap-2">
                            <Image
                                src={link.icon}
                                width={25}
                                height={25}
                                alt={"icon"} />
                            <p className="w-[65px] break-words">{link.name}</p>
                        </div>
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
                        className={linkClass}
                    >
                        <Image
                            src="/buttons/button-2.png"
                            width={130}
                            height={80}
                            alt={"button background"}
                        />
                        <div className="flex flex-row flex-grow-0 -ml-[113px] gap-2">
                            <Image
                                src={link.icon}
                                width={25}
                                height={25}
                                alt={"icon"} />
                            <p className="w-[65px] break-words">{link.name}</p>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}

