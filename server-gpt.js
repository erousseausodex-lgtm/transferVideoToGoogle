const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

// Route pour uploader la vidéo et la transcrire
app.post("/upload-video", upload.single("video"), async (req, res) => {
    try {
        // Lire le fichier vidéo
        const videoPath = req.file.path;

        // Envoyer la vidéo à l'API Whisper d'OpenAI pour la transcription
        const transcriptionResponse = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            fs.createReadStream(videoPath),
            {
                headers: {
                    Authorization: `Bearer ${process.env.gptKey}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        const transcription = transcriptionResponse.data.text;

        // Supprimer le fichier après utilisation
        fs.unlinkSync(videoPath);

        // Envoyer la transcription à ChatGPT pour analyse
        const chatResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Analyze this transcription and provide a review." },
                    { role: "user", content: transcription }
                ]
            },
            {
                headers: { Authorization: `Bearer ${process.env.gptKey}` }
            }
        );

        res.json({ analysis: chatResponse.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



