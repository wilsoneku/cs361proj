import SkillsBox from "@/app/ui/skills/skills-box";

export default function Page() {
    return (
            <div className="flex flex-col w-full text-center gap-2.5 items-center">
                <div className="flex flex-col gap-12">
                    <div className='text-4xl font-bold'>
                        Skills
                    </div>
                    <div className="text-xl">
                        Select a skill to view all of its popular methods
                    </div>
                </div>
                <div className="pt-28">
                    <SkillsBox />
                </div>

            </div>
    );
}