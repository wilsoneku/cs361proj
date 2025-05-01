import SkillsBox from "@/app/ui/skills/skills-box";

export default function Page() {
    return (
            <div className="flex flex-col justify-center items-center w-full gap-24">
               <h2>
                   Skills
               </h2>

               <SkillsBox />
            </div>
    );
}