const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const stream = require("stream");



// Use a closure to store shared data
const sharedData = {
  rowNumber: null,
  sessionId: null,
  fileData: null,
};



const upload = multer(); // Initialize multer for handling file uploads

// Add the middleware here to log all incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});



//Serve static files
app.use(express.static("public"));


app.post("/upload", upload.single("file"), async (req, res) => {
  
  console.log("upload route triggered");
  try {
    const file = req.file;
    if (!file) {
      throw new Error("No file uploaded.");
    }

    if (!file.mimetype.startsWith("video/")) {
      throw new Error("Invalid file type. Only videos are allowed.");
    }

    const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH;

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const driveService = google.drive({
      version: "v3",
      auth,
    });

    const fileMetaData = {
      name: "recorded-video.webm",
      parents: [process.env.folderId], // Replace with your folder ID
    };

    // Create a readable stream from the file buffer
    const fileStream = new stream.PassThrough();
    fileStream.end(file.buffer);

    const media = {
      mimeType: "video/webm",
      body: fileStream,
    };

    const driveResponse = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: "id, webViewLink",
    });

    console.log("File created with ID:", driveResponse.data.id);
    console.log("File URL:", driveResponse.data.webViewLink);

    // Store fileData in sharedData
    sharedData.fileData = driveResponse.data.webViewLink;
    console.log("Shared Data before updating Google Sheet:", sharedData);


    // Add the file information to the Google Sheet
    await updateGoogleSheet(sharedData);

    res.json({ fileId: driveResponse.data.id, webViewLink: driveResponse.data.webViewLink });
  } catch (error) {
    console.error("Error creating file:", error.message);
    res.status(500).json({ error: "Error creating file on Google Drive." });
  }
});

// Function to update Google Sheet
async function updateGoogleSheet(sharedData) {
  try {
    const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH;

    const auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheetsService = google.sheets({
      version: "v4",
      auth,
    }).spreadsheets.values;

    const rowNb = sharedData.rowNumber;
    if (!rowNb || isNaN(rowNb)) {
      throw new Error("Invalid row number.");
    }

    const spreadsheetId = process.env.gSheet_Id;
    
    const range = `'reportage Video'!A${rowNb}:C${rowNb}`; // Adjust the range as needed

    const values = [[sharedData.sessionId, "", sharedData.fileData]];

    await sheetsService.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });

    console.log("File information added to Google Sheet.");
  } catch (error) {
    console.error("Error updating Google Sheet:", error.message);
    throw error;
  }
}

// Serve the main HTML page
app.get("/", (req, res) => {
  sharedData.rowNumber = req.query.rowNumber;
  sharedData.sessionId = req.query.sessionId;

  console.log("Shared Data:", sharedData);
  res.sendFile(path.join(__dirname, "public/views/index.html"));
});

// Start the server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
