'use client'
import {altUserSearchActions} from "@/app/ui/user-search/alt-user-search-actions";
import {useActionState} from "react";
import Form from 'next/form'
import DisplayXp from "@/app/ui/user-search/display-xp";

interface SkillInfo {
    level: number;
    xp: number;
}

interface UserSearchProps {
    skill: string;
}

type SearchData = [string | null, string | null, SkillInfo | null] | null;

export default function UserSearch({skill}: UserSearchProps) {
    const initialData: SearchData = [null, null, null];
    const [replyData, action, isLoading] = useActionState(altUserSearchActions, initialData);

    return (
        <div className="flex flex-col justify-center items-cen w-full">
            <Form
                action={action}
                className="flex flex-col justify-center items-center mt-8 gap-2"
            >
                <div className="flex flex-row justify-center items-center gap-2">
                    <p className="w-auto whitespace-nowrap">User Lookup:</p>
                    <input
                        className="w-full h-[35px] rounded-md border-gray-300 focus:ring-1 focus:ring-gray-800"
                        type="text"
                        name='user'
                        id='rsn'
                        required
                        size={12}
                        placeholder="Search by RSN"
                    />
                    <input type="hidden" name="skill" value={skill}/>
                    <button
                        type="submit"
                        className="flex h-full items-center px-3 py-1 rounded-md border border-gray-300 hover:ring-1 hover:ring-gray-800"
                    >
                        {isLoading ? "Fetching..." : "Submit"} </button>
                </div>
            </Form>
            <DisplayXp data={replyData} />
        </div>

    );
}