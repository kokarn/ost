export default async function loadJSON(url) {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        return result;
    } catch (error) {
        console.error(`Error loading JSON from ${url}`);
        console.error(error);
    }
};