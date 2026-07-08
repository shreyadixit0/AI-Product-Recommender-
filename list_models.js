const { GoogleGenAI } = require('@google/genai');

async function testModel(modelName) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: "Say hi",
    });
    console.log(modelName, "SUCCESS!");
  } catch (e) {
    console.error(modelName, "FAILED:", e.message);
  }
}

async function run() {
    await testModel('gemini-flash-latest');
    await testModel('gemini-3.5-flash');
}
run();
