Google Sheets
===============
A sample app that authenticates with, and gets data from, the Google Sheets API.

![](https://cdn.glitch.com/649d5871-e041-4e46-8908-9ff392db5968%2FgoogleSheetsGIF.gif?1493932296981)

## Getting Set Up
- You will need to [create an app](https://console.developers.google.com/apis/dashboard) and enable the Google Sheets and Google Plus APIs.
- Then get the client ID and secret, and set them in the `.env` file.
- Set your Glitch project URL with '/login/google/return' appended to the end in the `Authorized redirect URIs` field for your app.
- You get the `SHEET_KEY` from your [spreadsheet's URL](https://webapps.stackexchange.com/questions/74205/what-is-the-key-in-my-google-spreadsheets-url).
- The example gets data from the first two rows, columns A to K, but you can [change the range](https://glitch.com/edit/#!/google-sheets?path=server.js:111:11).
