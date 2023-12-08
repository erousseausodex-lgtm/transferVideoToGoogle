const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID; // Replace with your OAuth client ID

const CLIENT_SECRET = process.env.CLIENT_SECRET;

const REDIRECT_URI = process.env.redirect_URI;
const REFRESH_TOKEN =
  "1//04dC92Si0aJOdCgYIARAAGAQSNwF-L9IrbSWqHOCfm9ajM5Pfcycv_MlunyQ8_l-ZqbcdxhBrPRwpAoRf_zJx5LYDUytGLXp_D88";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version:'v3',
  auth:oauth2Client
})

//const filePath = path.join(__dirname, 'Assets', 'logo.png','logo.png');
const fileUrl = 'https://cdn.glitch.global/151b8a04-c447-4677-aa3e-8e3bb0c22fe5/logo.png?v=1702023343969'
async function uploadFile(){
  try{
    const response = await drive.files.create({
      requestBody:{
        name:'logo sode',
        mimeType:'image/png'
      },
      media:{
        mimeType:'image/png',
        body:fs.createReadStream(fileUrl),
      },
    });
    console.log(response.data);
  }catch(error){
    console.log(error.message)
  }
}

uploadFile();

// node server.js

// npm install

//       const SCOPES = "1//04dC92Si0aJOdCgYIARAAGAQSNwF-L9IrbSWqHOCfm9ajM5Pfcycv_MlunyQ8_l-ZqbcdxhBrPRwpAoRf_zJx5LYDUytGLXp_D88https://www.googleapis.com/auth/drive.file";

//       // Load the Google API client library
//       function handleClientLoad() {
//         console.log("handleClientLoad called");
//     // Load the Google Identity Services library
// gapi.load('auth2', () => {
//     // Initialize the library with your client ID
//    gapi.auth2.init({
//         client_id: 'CLIENT_ID',
//     }).then(() => {
//         // Your initialization code and further actions
//         console.log('Google Identity Services initialized successfully');
//     }).catch((error) => {
//         console.error('Error initializing Google Identity Services:', error);
//     });
// });
//       }
//       //       const authUrl = auth2.generateAuthUrl({
//       //   access_type: 'offline',
//       //   scope: 'https://www.googleapis.com/auth/drive',
//       // });

//       function initClient() {
//         console.log("initClient called");
//         gapi.client
//           .init({
//             clientId: CLIENT_ID,
//             discoveryDocs: DISCOVERY_DOCS,
//             scope: SCOPES,
//           origin: 'https://webcamstoregoogle.glitch.me'
//           })
//           .then(() => {
//             // Listen for sign-in state changes
//             gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

//             // Check the initial sign-in state
//             updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

//             // If the user is not signed in, initiate the sign-in process
//             if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
//               gapi.auth2
//                 .getAuthInstance()
//                 .signIn()
//                 .then(() => {
//                   console.log("Sign-in successful");
//                   // You may perform additional actions after successful sign-in if needed
//                 })
//                 .catch((error) => {
//                   console.error("Error signing in:", error);
//                 });
//             }
//           })
//           .catch((error) => {
//             console.error("Error initializing Google API client:", error);
//           });
//       }

//       function updateSigninStatus(isSignedIn) {
//         if (isSignedIn) {
//           // Upload the recorded video to Google Drive
//           uploadToDrive();
//         }
//       }
//       handleClientLoad();
// function uploadToDrive() {
//   const blob = new Blob(recordedChunks, { type: "video/webm" });
//   const metadata = {
//     name: "recorded_video.webm",
//     mimeType: "video/webm",
//   };

//   const form = new FormData();
//   form.append(
//     "metadata",
//     new Blob([JSON.stringify(metadata)], { type: "application/json" })
//   );
//   form.append("file", blob);

//   gapi.client.drive.files
//     .create({
//       resource: metadata,
//       media: {
//         mimeType: "video/webm",
//         body: form,
//       },
//     })
//     .then((response) => {
//       console.log("File ID:", response.result.id);
//     })
//     .catch((error) => {
//       console.error("Error uploading to Google Drive:", error);
//     });
// }

// // Start the OAuth flow when the record button is clicked
// loadFile.addEventListener("click", () => {
//   console.log("loadFile");
//   // Initiate the sign-in process when the element is clicked
//   gapi.auth2
//     .getAuthInstance()
//     .signIn()
//     .then(
//       () => {
//         console.log("Sign-in successful");
//         // Perform additional actions after successful sign-in if needed
//       },
//       (error) => {
//         console.error("Error signing in:", error);
//       }
//     );
// });

// // Stop recording when the stop button is clicked
// stopButton.addEventListener("click", () => {
//   mediaRecorder.stop();
//   recordButton.disabled = false;
//   stopButton.disabled = true;
// });

// Initialize the Google API client library
//  handleClientLoad();
