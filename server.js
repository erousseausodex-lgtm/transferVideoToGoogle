const fs = require('fs');
const readline = require('readline');
const {google}= require('googleapis');

const KEYFILEPATH = 'C:\Users\33687\Downloadsclassroomstore-7507cf2dd39f'
      
      const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth(opt:{
                                        keyFile:KEYFILEPATH,
                                        scopes:SCOPES
                                        });
aync function createAndUploadFile(auth){
  const driveService = google.drive(options:{version:'v3',auth});
  
let fileMetaData = {
  'name':'logo.png'
  
    
}

let media = {
  mimeType:'logo.png',
  body:fs.createReadStream(path:'logo.png')
}

let response = await driveService.files.create(params:{
      ressource:  fileMetaData,
           media:media,
          fields :'id'
                                               
         })
switch(response.status){
    code 200;
    console.log('File created',response.data.id);
    break;
}
}
// node server.js