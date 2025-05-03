'use server'

interface SkillInfo {
    level: number;
    xp: number;
}

type SearchResult = [string | null, string | null, SkillInfo | null];

async function getData(rsn:string) {
    const url = 'https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player='

    try {
        console.log(url + rsn)
        const response = await fetch(url + rsn);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();

    } catch (error: any) {
        console.error(error.message);
        return null;
    }
}

function getSkillInfo(data: any, skill:string) {
    try {
        if (!data?.skills) return null;
        // Case-insensitive match
        const found = data.skills.find(
            (s: any) => s.name.toLowerCase() === skill.toLowerCase()
        );
        return found ? { level: found.level, xp: found.xp } : null;

    } catch (error) {
        console.error('Error processing data:', error);
        return null;
    }

}


export async function altUserSearchActions(prevData:any, formData: FormData): Promise<SearchResult>
{
    const username = formData.get("user")
    const skill = formData.get("skill")

    console.log(username)
    console.log(skill)

    const data = await getData(username as string);
    console.log(data)

    const skillInfo = getSkillInfo(data, skill as string);
    console.log([username, skill, skillInfo])

    return [username as string, skill as string, skillInfo]
}

