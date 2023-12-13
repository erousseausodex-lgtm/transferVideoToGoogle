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
  
  const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH ;

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
    
      // Add the file information to the Google Sheet
    await updateGoogleSheet(driveResponse.data);

    res.json({ fileId: driveResponse.data.id });
    
    
  } catch (error) {
    console.error('Error creating file:', error.message);
    res.status(500).json({ error: 'Error creating file on Google Drive500' });
  }
});
// add webviewlink to last row
async function updateGoogleSheet(fileData) {
  const keyFilePath = process.env.GOOGLE_KEY_FILE_PATH;

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
   const sheetsService = sheets.spreadsheets.values;

  // const sheetsService = google.sheets({
  //   version: 'v4',
  //   auth,
  // });

  const spreadsheetId = '15qWfOkfmpYaHteMxghAhJtJjYKX8NZWB8j4LBz3ifzU';
  const range = 'FEST!A10:B10'; // Adjust the range as needed

  const values = [
    [ fileData.webViewLink, new Date()],
    ];
  
 await sheetsService.append({
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
