Google Passport Example
========================

This app is a building block for using Google OAuth using [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2). You will need to [create an app](https://console.developers.google.com/apis/dashboard) and enable APIs to obtain the ID and secret required to be set in the `.env` file.

Be sure to set your Glitch project URL with '/login/google/return' appended to the end in the `Authorized redirect URIs` field for your app.

## View the Code

On the back-end,
- the app starts at `server.js`
- frameworks and packages are in `package.json`
- app secrets are safely stored in `.env`

On the front-end,
- edit `index.html` and `success.html`
- drag in `assets`, like images or music, to add them to your project

Made by Fog Creek
-----------------

\ ゜o゜)ノ
