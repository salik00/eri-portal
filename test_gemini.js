const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

function getApiKey() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");
        const match = envContent.match(/GOOGLE_AI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

async function testModels() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("No API Key found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro"
    ];

    console.log("--- Testing Gemini Models ---");
    for (const modelId of modelsToTest) {
        try {
            console.log(`Testing ${modelId}...`);
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent("Hi. 1 word answer.");
            const response = await result.response;
            console.log(`✅ ${modelId}: SUCCESS - "${response.text().trim()}"`);
        } catch (error) {
            console.log(`❌ ${modelId}: FAILED - ${error.message}`);
        }
    }
}

testModels();
