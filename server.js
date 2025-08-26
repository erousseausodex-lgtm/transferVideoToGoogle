gzip: stdin: not in gzip format
tar: Child returned status 1
tar: Error is not recoverable: exiting now
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ tar xf transfervideotogoogle.tgz
tar: app/node_modules: Cannot create symlink to ‘/rbd/pnpm-volume/app/node_modules’: Permission denied
tar: app/.node-gyp: Cannot create symlink to ‘/tmp/.node-gyp’: Permission denied
tar: Exiting with failure status due to previous errors
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ ^C
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ tar xf transfervideotogoogle.tgz
tar: app/node_modules: Cannot create symlink to ‘/rbd/pnpm-volume/app/node_modules’: Permission denied
tar: app/.node-gyp: Cannot create symlink to ‘/tmp/.node-gyp’: Permission denied
tar: Exiting with failure status due to previous errors
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ tar xf transfervideotogoogle.tgz
tar: app/node_modules: Cannot create symlink to ‘/rbd/pnpm-volume/app/node_modules’: Permission denied
tar: app/.node-gyp: Cannot create symlink to ‘/tmp/.node-gyp’: Permission denied
tar: Exiting with failure status due to previous errors
-bash: erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$: No such file or directory
-bash: tar:: command not found
-bash: tar:: command not found
-bash: tar:: command not found
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ ls app
classroomstore.json  LICENSE.md  package.json  package-lock.json  public  server-gpt.js  server.js  shrinkwrap.yaml  style.css  uploads  views
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ ls app
classroomstore.json  LICENSE.md  package.json  package-lock.json  public  server-gpt.js  server.js  shrinkwrap.yaml  style.css  uploads  views
-bash: erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$: No such file or directory
-bash: classroomstore.json: command not found
erousseausodex@penguin:/mnt/chromeos/MyFiles/Downloads$ cat app/server.js
const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { google } = require("googleapis");
// const fs = require("fs");
const stream = require("stream");

// Use a closure to store shared data
const sharedData = {
  rowNumber: null,
  sessionId: null,
  userName: null,
  theme: null,
  fileData: null,
};

const upload = multer(); // Initialize multer for handling file uploads

// Add the middleware here to log all incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);

  // Store parameters only if they exist (for GET requests)
  if (req.method === "GET" && req.query.sessionId) {
    sharedData.rowNumber = req.query.rowNumber || null;
    sharedData.sessionId = req.query.sessionId || null;
    sharedData.userName = req.query.userName || null;
    sharedData.theme = req.query.theme || null;
    console.log("Updated Shared Data:", sharedData);
  }

  next();
});


app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("upload route triggered");

  try {
    // Extract URL parameters
    const { sessionId, userName, theme } = sharedData; // Ensure correct query extraction

    if (!sessionId || !userName || !theme) {
      throw new Error("Missing required parameters (sessionId, userName, theme).");
    }

    // Store them in sharedData
    sharedData.sessionId = sessionId;
    sharedData.userName = userName;
    sharedData.theme = theme;

    console.log("Updated Shared Data:", sharedData);

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
      parents: [process.env.folderId],
    };

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

    res.json({
      fileId: driveResponse.data.id,
      webViewLink: driveResponse.data.webViewLink,
    });
  } catch (error) {
    console.error("Error creating file:", error.message);
    res.status(500).json({ error: "Error creating file on Google Drive." });
  }
});




// Function to update Google Sheet

async function updateGoogleSheet(sharedData) {
  // 1) Auth using a Service Account
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_KEY_FILE_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.gSheet_Id; // e.g. "1abcD-efg..."
  const sheetName = "reportage Video"; // Your sheet/tab name

  // 2) Read current rows to find the last row
  const readRange = `${sheetName}!A:A`; // If column A always has data
  const getRowsRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: readRange,
  });
  const rows = getRowsRes.data.values || []; // 'values' is an array of rows
  const lastRow = rows.length; // zero-based, or just count
  const newRowIndex = lastRow + 1; // If the first row is the header, adjust accordingly

  // 3) Now store newRowIndex in sharedData or use it directly
  sharedData.rowNumber = newRowIndex;

  // 4) Write data into the new row
  const writeRange = `${sheetName}!A${newRowIndex}:D${newRowIndex}`;
  // Example: writing 3 columns (A, B, C)
  const values = [
    [
      sharedData.sessionId, // columnA
      sharedData.userName, // Column B
      sharedData.fileData, // Column C
      sharedData.theme
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
