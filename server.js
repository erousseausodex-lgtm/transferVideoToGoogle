const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');


const KEYFILEPATH = 'C:\\Users\\33687\\Downloads\\classroomstore-7507cf2dd39f';
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

  let fileMetaData = {
    name: 'logo.png'
  };

  let media = {
    mimeType: 'image/png',
     body: fs.createReadStream('app/Assets/logo.png')
  };

  try {
    let response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id'
    });

    switch (response.status) {
      case 200:
        console.log('File created', response.data.id);
        break;
    }
  } catch (error) {
    console.error('Error creating file:', error.message);
  }
}

// Call the function with the auth object
createAndUploadFile(auth);

// node server.js