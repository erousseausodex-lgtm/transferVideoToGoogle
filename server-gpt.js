const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
//nose server-gpt.jsrequire("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" }); // Stocke temporairement les fichiers

// Route pour traiter la vidéo et extraire la transcription
app.post("/upload-video", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucune vidéo reçue" });
        }

        const videoPath = req.file.path;

        console.log("📹 Vidéo reçue :", videoPath);

        // Envoyer la vidéo à Whisper API pour la transcription
        const whisperResponse = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            fs.createReadStream(videoPath),
            {
                headers: {
                    Authorization: `Bearer ${process.env.gptKey}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        const transcription = whisperResponse.data.text;
        console.log("📝 Transcription obtenue :", transcription);

        // Supprimer la vidéo après transcription
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

        console.log("🤖 Analyse GPT :", chatResponse.data.choices[0].message.content);

        res.json({ analysis: chatResponse.data.choices[0].message.content });

    } catch (error) {
        console.error("❌ Erreur :", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Erreur lors du traitement de la vidéo" });
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Serveur GPT en ligne sur le port ${PORT}`));
