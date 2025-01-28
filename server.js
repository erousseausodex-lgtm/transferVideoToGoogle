// serve satic html
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

const axios = require('axios');
const { google } = require('googleapis');
const stream = require('stream');

//const fs = require('fs');

const KEYFILEPATH = 'classroomstore-7507cf2dd39f.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

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

    console.log('File created with ID:', driveResponse.data.id);
    console.log('File URL:', driveResponse.data.webViewLink);
    console.log('File name:',driveResponse.data.name);
    
     process.exit(); // Terminate the script after successful execution

 

   
    
  } catch (error) {
    console.error('Error creating file:', error.message);
     process.exit(1); // Terminate the script with an error code

    
  }

}
console.log('Script started at', new Date());
//createAndUploadFile(auth);

console.log('Script ended at', new Date());


// // node server.js

