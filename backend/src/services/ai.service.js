const {GoogleGenAI}=require("@google/genai");

const ai=new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

async function checkIfValid(base64File, mimeType, text)
{
    try
    {
        const contents=[
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64File,
                },
            },
            {
                text: `${text}`,
            },
        ];
        const response=await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: ` You are an ID verification assistant.
        Rules:
        - Output strictly "0" (not match/invalid) or "1" (match/valid).
        - Check if the ID is valid (Aadhaar, PAN, Driving License, etc). If not, output 0.
        - If QR is visible, scan it too.
        - Match name, DOB, gender with the provided text. First name only match is okay.
        - If the ID shows an image and it doesn’t match gender (e.g., user says female but ID shows male), output 0.
        - Check if address in ID matches user’s address. If mismatch, output 0.
        - Validate bio, skills, experience, and emergency contact — if anything looks wrong, output 0.
        - Return only 0 or 1.
        - If 0, give a brief explanation why.`,
                temperature: 0,

            },
        });

        return response.text;
    } catch (err)
    {
        console.error("Gemini check error:", err);
        return 0;
    }
}

module.exports={checkIfValid};
