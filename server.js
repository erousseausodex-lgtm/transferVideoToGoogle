const axios = require('axios');
const { google } = require('googleapis');
const stream = require('stream');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.post('/trigger-action', (req, res) => {
  
    createAndUploadFile(auth);
 
  console.log('Action triggered by button click!');
  res.status(200).send('Action triggered successfully');
});


const KEYFILEPATH = 'classroomstore-7507cf2dd39f.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES
});

async function createAndUploadFile(auth) {
  const driveService = google.drive({
    version: 'v3',
    auth
  });

  // URL of the 'logo.png' asset
  const assetUrl = 'https://cdn.glitch.global/151b8a04-c447-4677-aa3e-8e3bb0c22fe5/logo.png?v=1702023343969';

  try {
    const response = await axios.get(assetUrl, { responseType: 'stream' });

    let fileMetaData = {
      name: 'logo.png',
      parents:['14D_ANHPoaMvTn5ERk1lrwKW3xEz0_XFs']
    };

     const media = {
      mimeType: 'image/png',
      body: response.data.pipe(new stream.PassThrough())
    };

    let driveResponse = await driveService.files.create({
      requestBody: fileMetaData,
      media: media,
      fields: 'id, webViewLink'
    });
    
    const fileMetadata = await driveService.files.get({
  fileId: driveResponse.data.id,
  fields: 'id, name, parents, webViewLink'
});

console.log('File Metadata:', fileMetadata.data);

    
    

    console.log('File created with ID:', driveResponse.data.id);
    console.log('File URL:', driveResponse.data.webViewLink);
    console.log('File name:',driveResponse.data.name);
    
   
  } catch (error) {
    console.error('Error creating file:', error.message);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// try {
//   // Other code...
//   createAndUploadFile(auth);
// } catch (error) {
//   console.error('Error outside createAndUploadFile:', error.message);
// }

// // node server.js
  