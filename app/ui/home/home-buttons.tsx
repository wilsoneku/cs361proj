import Image from "next/image";
import Link from "next/link";

const links = [
    { name: 'Market', href: '/market', icon: '/icons/Grand Exchange logo.png'},
    { name: 'Skills', href: '/skills', icon: '/icons/Stats_icon.png'},
    { name: 'Calculators', href: '/calculators', icon: '/icons/calculators_icon.png'},
];

export function HomeButtons() {
    return (
        <div className="flex flex-row justify-center gap-12 ">
            {links.map((link) => {
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="flex flex-col justify-center items-center gap-2 rounded-md"
                    >

                        <Image
                            src="/buttons/button-1.png"
                            width={200}
                            height={200}
                            alt="background image for navigation button"/>
                        <div className='-mt-28 flex flex-row justify-center items-center gap-2'>

                            <Image
                                src={link.icon}
                                width={32}
                                height={32}
                                alt={"icon"} />
                            <p className="text-xl font-medium">{link.name}</p>
                        </div>

                    </Link>
                );
            })}
        </div>
    );
}