Google Sheets
===============
A sample app that authenticates with, and gets data from the Google Sheets API.



## Getting Set Up
- You will need to [create an app](https://console.developers.google.com/apis/dashboard) and enable the Google Sheets and Google Plus APIs.
- Then get the client ID and secret, and set them in the `.env` file.
- Set your Glitch project URL with '/login/google/return' appended to the end in the `Authorized redirect URIs` field for your app.
- You get the `SHEET_KEY` from your [spreadsheet's URL](https://webapps.stackexchange.com/questions/74205/what-is-the-key-in-my-google-spreadsheets-url).

