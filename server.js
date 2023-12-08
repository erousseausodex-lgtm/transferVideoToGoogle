const fs = require('fs');
const readline = require('readline');
const {google}= require('googleapis');

const KEYFILEPATH = 'C:\Users\33687\Downloadsclassroomstore-7507cf2dd39f'
      
      const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.googleAuth(opt:{
                                        keyFile:KEYFILEPATH,
                                        scopes:SCOPES
                                        });
aync function createAndUploadFile(auth){
  const drive
}