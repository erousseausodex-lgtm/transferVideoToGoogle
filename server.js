const express = require("express");
const app = express();
// const path = require("path");
const multer = require("multer");
const { google } = require("googleapis");
// const fs = require("fs");
// const stream = require("stream");


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

// Serve static files
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
  // 1) Auth using a Service Account
  const auth = new google.auth.GoogleAuth({
    keyFile:process.env.GOOGLE_KEY_FILE_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.gSheet_Id;  // e.g. "1abcD-efg..."
  const sheetName = "reportage Video";                   // Your sheet/tab name

  // 2) Read current rows to find the last row
  const readRange = `${sheetName}!A:A`; // If column A always has data
  const getRowsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: readRange,
  });
  const rows = getRowsRes.data.values || []; // 'values' is an array of rows
  const lastRow = rows.length;              // zero-based, or just count
  const newRowIndex = lastRow + 1;          // If the first row is the header, adjust accordingly

  // 3) Now store newRowIndex in sharedData or use it directly
  sharedData.rowNumber = newRowIndex;

  // 4) Write data into the new row
  const writeRange = `${sheetName}!A${newRowIndex}:C${newRowIndex}`; 
  // Example: writing 3 columns (A, B, C)
  const values = [
    [
      sharedData.fileData,       // Column A
      sharedData.sessionId,      // Column B
      new Date().toISOString(),  // Column C
    ],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: writeRange,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  console.log("Google Sheet updated on row:", newRowIndex);
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
