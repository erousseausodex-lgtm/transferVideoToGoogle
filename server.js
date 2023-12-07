
  //  const express = require('express');
const { google } = require('googleapis');
      // Google API configuration
      const CLIENT_ID =
        "718567027975-kjb0bummtdci91vqb15t996et5m8ncj7.apps.googleusercontent.com"; // Replace with your OAuth client ID
      //const API_KEY = 'your-api-key'; // Not needed for OAuth, but might be required by some APIs
      const DISCOVERY_DOCS = [
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
      ];
      const SCOPES = "https://www.googleapis.com/auth/drive.file";

      // Load the Google API client library
      function handleClientLoad() {
        console.log("handleClientLoad called");
    // Load the Google Identity Services library
gapi.load('auth2', () => {
    // Initialize the library with your client ID
   gapi.auth2.init({
        client_id: 'CLIENT_ID',
    }).then(() => {
        // Your initialization code and further actions
        console.log('Google Identity Services initialized successfully');
    }).catch((error) => {
        console.error('Error initializing Google Identity Services:', error);
    });
});
      }
      //       const authUrl = auth2.generateAuthUrl({
      //   access_type: 'offline',
      //   scope: 'https://www.googleapis.com/auth/drive',
      // });

      function initClient() {
        console.log("initClient called");
        gapi.client
          .init({
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          origin: 'https://webcamstoregoogle.glitch.me'
          })
          .then(() => {
            // Listen for sign-in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Check the initial sign-in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            // If the user is not signed in, initiate the sign-in process
            if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
              gapi.auth2
                .getAuthInstance()
                .signIn()
                .then(() => {
                  console.log("Sign-in successful");
                  // You may perform additional actions after successful sign-in if needed
                })
                .catch((error) => {
                  console.error("Error signing in:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error initializing Google API client:", error);
          });
      }

      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          // Upload the recorded video to Google Drive
          uploadToDrive();
        }
      }
      handleClientLoad();
      function uploadToDrive() {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const metadata = {
          name: "recorded_video.webm",
          mimeType: "video/webm",
        };

        const form = new FormData();
        form.append(
          "metadata",
          new Blob([JSON.stringify(metadata)], { type: "application/json" })
        );
        form.append("file", blob);

        gapi.client.drive.files
          .create({
            resource: metadata,
            media: {
              mimeType: "video/webm",
              body: form,
            },
          })
          .then((response) => {
            console.log("File ID:", response.result.id);
          })
          .catch((error) => {
            console.error("Error uploading to Google Drive:", error);
          });
      }

      // Start the OAuth flow when the record button is clicked
      loadFile.addEventListener("click", () => {
        console.log("loadFile");
        // Initiate the sign-in process when the element is clicked
        gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(
            () => {
              console.log("Sign-in successful");
              // Perform additional actions after successful sign-in if needed
            },
            (error) => {
              console.error("Error signing in:", error);
            }
          );
      });

      // Stop recording when the stop button is clicked
      stopButton.addEventListener("click", () => {
        mediaRecorder.stop();
        recordButton.disabled = false;
        stopButton.disabled = true;
      });

      // Initialize the Google API client library
      //  handleClientLoad();
    
