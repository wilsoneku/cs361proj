'use server'

interface JSONOutput {
    inputs: Record<string, number>;
    outputs: Record<string, number>;
}

export async function getSavedCalculations() {
    const url = 'http://localhost:8004/load'
    try {
        console.log('Fetching all saved calculations')
        const response = await fetch(url, {
            method: 'GET',
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


export const uploadToDatabase = async (jsonData: JSONOutput) => {
    // setIsUploading(true);
    // setUploadStatus('');

    try {
        const response = await fetch('http://localhost:8004/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            console.log("generated JSON: ", jsonData)
            const result = await response.json();
            // setUploadStatus('✅ Successfully uploaded calculation!');
            console.log('Upload successful:', result);

            // Clear form after successful upload
            setTimeout(() => {
                // setSelectedItems([]);
                // setGeneratedJSON(null);
                // setUploadStatus('');
                // onClose();
            }, 2000);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Upload failed:', error);
        // setUploadStatus('❌ Upload failed. Please try again.');
    } finally {
        // setIsUploading(false);
    }
};