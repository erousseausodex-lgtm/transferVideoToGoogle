const axios = require('axios');
const { google } = require('googleapis');
const stream = require('stream');

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
      name: 'logo.png'
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
  } catch (error) {
    console.error('Error creating file:', error.message);
  }
}

// Call the function with the auth object
createAndUploadFile(auth);


// node server.js