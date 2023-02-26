const { google } = require('googleapis');
const keys = require('./keys.json');

// Create a new JWT client using the service account's private key
const jwtClient = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// Authorize the client and get a reference to the Google Sheets API
jwtClient.authorize((err, tokens) => {
  if (err) {
    console.error(err);
    return;
  }else{
    console.log('connected');
    gsrun(jwtClient);
  }

 });

async function gsrun(cl){
  const gsapi = google.sheets({version:'v4',auth:cl});
  const opt = {
    spreadsheetId:'1nTPv5bzR6o4232vrEnpYJQSk03RbYbq9RTh-xizCUM8',
    range:'videos!A2:C2'
  };
  let data = await gsapi.spreadsheets.values.get(opt);
  console.log(data.data.values);
  
  //let dataArray = data.data.values;

  
  let newDataArray =['henri','john'];
 // console.log(newDataArray);
 const updateOptions = {
    spreadsheetId:'1nTPv5bzR6o4232vrEnpYJQSk03RbYbq9RTh-xizCUM8',
    range:'videos!A4',
    valueInputOption:'USER_ENTERED',
    resource:{values: newDataArray}
  };  
let res = await gsapi.spreadsheets.values.update(updateOptions);
  console.log(res);
}
