const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { google } = require('googleapis');
const stream = require('stream');
const axios = require('axios');

app.use(express.static('public'));

const upload = multer(); // Initialize multer for handling file uploads

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  
   console.log('Received file:', file);

  const auth = new google.auth.GoogleAuth({
    keyFile: 'classroomstore-7507cf2dd39f.json', // Replace with your service account key path
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

    const media = {
      mimeType: 'video/webm',
      body: file.buffer, // Use the buffer of the uploaded file
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
    res.status(500).json({ error: 'Error creating file on Google Drive' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
