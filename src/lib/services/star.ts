import { StarMessageData } from "../types/misc";

export const getRandomStar = async () => {
    try {
        const response = await fetch("/api/stars/random", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(`⚠️ HTTP error: ${response.status}`);
        }

        const data = await response.json();

        return data.star as StarMessageData;
    } catch (error) {
        console.error("⚠️ error fetching random star:", error);
        return null;
    }
}