'use client'
import {submitUsername} from "@/app/ui/user-search/user-search-actions";
import Form from 'next/form'
import {useActionState} from "react";

export default function UserSearch() {
    const [state, action, isLoading] = useActionState(submitUsername, "");

    return (
            <Form
                action={action}
                className="flex flex-col justify-center items-center mt-8 gap-2"
            >
                    <div className="flex flex-row justify-center items-center gap-2">
                        <p className="w-auto"> User Lookup: </p>
                        <input
                            className="w-full h-[35px] rounded-md border-gray-300 focus:ring-1 focus:ring-gray-800"
                            type="text"
                            name='user'
                            id='Crafting'
                            required
                            placeholder="Search by Display Name"
                        />
                        <button type="submit"> Submit </button>
                    </div>

                    <div>
                        {state && <p>{state}</p>}
                    </div>
            </Form>
    );
}