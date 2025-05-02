import SkillsBox from "@/app/ui/skills/skills-box";

export default function Page() {
    return (
            <div className="flex flex-col items-center justify-center mt-4">
               <h2 className="text-4xl font-bold">
                   Skills
               </h2>
                <div className="pt-36">
                    <SkillsBox />
                </div>

            </div>
    );
}