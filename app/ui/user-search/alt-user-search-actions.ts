'use server'

interface SkillInfo {
    level: number;
    xp: number;
}

type SearchResult = [string | null, string | null, SkillInfo | null];

async function getData(rsn:string) {
    const url = 'http://localhost:8000/fetch-hiscores/'
    const payload = {'player_name': rsn}
    console.log('payload: ' + payload)
    try {
        console.log('Fetching data for:', rsn)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(3000)
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();
        return JSON.parse(text);

    } catch (error: any) {
        console.error(error.message);
        return null;
    }
}

function getSkillInfo(data: any, skill:string) {
    try {
        // Early return if no data or hiscores or skills array
        if (!data?.hiscores?.skills) {
            console.log('No hiscores data found');
            return null;
        }

        console.log('Looking for skill:', skill);

        // Case-insensitive match for the skill
        const found = data.hiscores.skills.find(
            (s: any) => s.name.toLowerCase() === skill.toLowerCase()
        );
        console.log('Found skill data:', found);

        if (found && typeof found.level === 'number' && typeof found.xp === 'number') {
            return {
                level: found.level,
                xp: found.xp
            };
        }

        console.log('Skill not found or invalid data');
        return null;

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

