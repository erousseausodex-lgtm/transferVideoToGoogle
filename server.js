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
  }

  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  // Define the range of cells where you want to insert the data
  const range = 'Sheet1!A1:B2';

  // Define the data to be inserted
  const values = [
    ['Value 1', 'Value 2'],
    ['Value 3', 'Value 4']
  ];

  // Call the Sheets API to insert the data
  sheets.spreadsheets.values.update({
    spreadsheetId: 'SPREADSHEET_ID',
    range: range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  }, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res.data);
  });
});
