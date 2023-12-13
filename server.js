const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const stream = require('stream');
const sheets = google.sheets('v4')

app.use(express.static('public'));

const upload = multer(); // Initialize multer for handling file uploads

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  
   console.log('Received file:', file);
  
  const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH 

  const auth = new google.auth.GoogleAuth({
    
    
   // keyFile: 'classroomstore-7507cf2dd39f.json', 
    keyFile:keyFilePath,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  try {
    const driveService = google.drive({
      version: 'v3',
      auth,
    });

    const fileMetaData = {
      name: 'recorded-video.webm',
      parents: ['14D_ANHPoaMvTn5ERk1lrwKW3xEz0_XFs'], // Replace with your folder ID
    };
    
    
    // Create a readable stream from the file buffer
    const fileStream = new stream.PassThrough();
    fileStream.end(file.buffer);

    const media = {
      mimeType: 'video/webm',
      //body: file.buffer, // Use the buffer of the uploaded file
       body: fileStream,
    };

    const driveResponse = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id, webViewLink',
    });

    console.log('File created with ID:', driveResponse.data.id);
    console.log('File URL:', driveResponse.data.webViewLink);
    console.log('File name:', driveResponse.data.name);

    res.json({ fileId: driveResponse.data.id });
  } catch (error) {
    console.error('Error creating file:', error.message);
    res.status(500).json({ error: 'Error creating file on Google Drive500' });
  }
});
// add webvie
async function updateGoogleSheet(fileData) {
  const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH;

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsService = google.sheets({
    version: 'v4',
    auth,
  });

  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  const range = 'Sheet1!A2:C2'; // Adjust the range as needed

  const values = [
    [fileData.name, fileData.webViewLink, new Date()],
  ];

  await sheetsService.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      values,
    },
  });

  console.log('File information added to Google Sheet.');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
