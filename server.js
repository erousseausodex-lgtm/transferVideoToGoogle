const express = require('express');
const { google } = require('googleapis');
const multer = require('multer');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Google Drive API configuration
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Homepage route
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload to Google Drive App!');
});

// Route to initiate the OAuth 2.0 authorization flow
app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

// Route to handle the OAuth 2.0 callback
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the refresh token securely in your database
    // tokens.refresh_token should be stored for future use

    res.send('Authentication successful! You can now upload a file.');
  } catch (error) {
    console.error('Error getting tokens:', error.message);
    res.status(500).send('Error during authentication.');
  }
});

// Route to handle file upload to Google Drive
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!oauth2Client.credentials || !oauth2Client.credentials.refresh_token) {
      return res.status(401).send('Unauthorized. Please authenticate first.');
    }

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // File metadata
    const fileMetadata = {
      name: req.file.originalname,
      mimeType: req.file.mimetype,
    };

    // File content
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    res.send(`File uploaded successfully! File ID: ${response.data.id}`);
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send('Error uploading file to Google Drive.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// //const filePath = path.join(__dirname, 'Assets', 'logo.png','logo.png');
// const fileUrl = 'https://cdn.glitch.global/151b8a04-c447-4677-aa3e-8e3bb0c22fe5/logo.png?v=1702023343969'
// async function uploadFile() {
//   try {
//     const response = await axios.get(fileUrl, { responseType: 'stream' });
    
//     const media = {
//       mimeType: 'image/png',
//       body: response.data,
//     };

//     const createFileResponse = await drive.files.create({
//       requestBody: {
//         name: 'logo sode',
//         mimeType: 'image/png',
//       },
//       media: media,
//     });

//     console.log(createFileResponse.data);
//   } catch (error) {
//     console.error(error.message);
//   }
// }
// uploadFile();

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
