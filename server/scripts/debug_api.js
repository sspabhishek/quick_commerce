import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models from:", URL.replace(API_KEY, "HIDDEN_KEY"));

async function debugModels() {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
        } else {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

debugModels();
