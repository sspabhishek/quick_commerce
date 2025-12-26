import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up (since this is in scripts/)
dotenv.config({ path: path.join(process.cwd(), '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get access to client if needed, or just use defaults
        // Actually the SDK doesn't have a direct 'listModels' on the instance easily exposed in all versions, 
        // but let's try to just run a simple generateContent on a known stable model or try to list if supported.
        // The error message suggested "Call ListModels". In the Node SDK, it might be via the client.

        // Actually, looking at docs/SDK, usually we guess. But let's try a very basic "gemini-1.0-pro" or similar.
        // OR we can try to fetch the models via direct fetch if SDK doesn't expose it easily.

        // Let's try the recently announced logic or just a fallback.
        // However, the error says: "Call ListModels to see the list".

        console.log("Testing Model Availability...");

        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        for (const modelName of candidates) {
            try {
                console.log(`Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} is working.`);
                console.log(result.response.text());
                break; // Found one!
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
