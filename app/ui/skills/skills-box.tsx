import {SkillLinks1, SkillLinks2, SkillLinks3} from "@/app/ui/skills/skill-links";

export default function SkillsBox() {
    return (
        <div className="flex w-full flex-row">
            <div className="flex flex-row justify-center items-start w-full">
                {/*SKILLS BOX*/}
                <div className="flex flex-col">
                    <SkillLinks1 />
                </div>
                <div className="flex flex-col">
                    <SkillLinks2 />
                </div>
                <div className="flex flex-col">
                    <SkillLinks3 />
                </div>
            </div>
        </div>
    );
}