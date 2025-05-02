import {SkillLinks1, SkillLinks2, SkillLinks3} from "@/app/ui/skills/skill-links";

export default function SkillsBox() {
    return (
            <div className="flex flex-row w-full gap-8">
                {/*SKILLS BOX*/}
                <div className="flex flex-col gap-3">
                    <SkillLinks1 />
                </div>
                <div className="flex flex-col gap-3">
                    <SkillLinks2 />
                </div>
                <div className="flex flex-col gap-3">
                    <SkillLinks3 />
                </div>
            </div>
    );
}