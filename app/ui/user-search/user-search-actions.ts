'use server';
import zmq from 'zeromq';

async function sendRsn(rsn:any) {
    try {
        const sock = new zmq.Request();
        sock.connect("tcp://localhost:8000")
        
        console.log('Connected to port 8000')

        await sock.send(rsn)
        const result = await sock.receive()
        const jsonData = JSON.parse(result.toString())
        console.log(jsonData)

        return jsonData

    }
    catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

function getSkillData(data: any, skill:any) {
    try {
        const jsonData = typeof data === 'string' ? JSON.parse(data) : data;

        // Check if the data has the expected structure
        if (jsonData && jsonData.skills) {
            // Look specifically for the Crafting skill
            // console.log(skill)
            const selectedSkill = jsonData.skills.find((skill: any) =>
                skill && skill.name === 'Crafting'
            );

            if (selectedSkill && typeof selectedSkill.level === 'number') {
                return selectedSkill.level;
            }
        }
        return null;

    } catch (error) {
        console.error('Error processing data:', error);
        return null;
    }

}

export async function submitUsername(prevData:any, formData: FormData) {
    const username = formData.get("user")
    const skill = formData.get("skill")
    console.log(username, skill)
    const data = await sendRsn(username)

    return getSkillData(data, skill)
}