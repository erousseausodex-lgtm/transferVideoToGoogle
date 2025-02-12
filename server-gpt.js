const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

// Fetch Transcription and Analyze with ChatGPT
app.post("/analyze-transcription", async (req, res) => {
    try {
        const storedTranscription = "Your stored transcription here"; // Retrieve from database or file
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [{ role: "system", content: "Analyze this transcription and provide a review." }, { role: "user", content: storedTranscription }],
        }, {
            headers: { Authorization: `Bearer ${process.env.gptKey}` }
        });
        
        res.json({ analysis: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`ChatGPT server running on port ${PORT}`));

// if (prompt) {
//     var apiKey = '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';
//     var apiUrl = 'https://api.openai.com/v1/chat/completions';
//     var payload = {
//         model: "gpt-4",
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: 400,
//         temperature: 0.1,
//         n: 1
//     };