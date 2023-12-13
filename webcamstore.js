      // add webcam///////////////////////////////////////////////////////////////////
      
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      var webcam = document.createElement('video');
      webcam.id ="webcam";
            document.getElementById('myCanvas').appendChild(webcam);
            console.log(document.getElementById('webcam'));
      webcam.width = 100;
      webcam.height = 75;
      webcam.autoplay = true;
      
          navigator.getUserMedia({
              video: true
          }, function (stream) {
           // console.log(stream)
              webcam.srcObject = stream;
          }, function (error) {
              console.log("Couldn't start video stream.");
          });
// installation d'un "moniteur" webcam
      var planeGeometry = new THREE.PlaneGeometry(2, 1.5);

      var texture = new THREE.VideoTexture( webcam );
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide  }  );
      var mesh = new THREE.Mesh( planeGeometry, material );
      mesh.rotateY((THREE.Math.degToRad(150)));
      mesh.rotateX((THREE.Math.degToRad(30)))
      mesh.position.set(-3,6,4)
      
      scene.add( mesh );
      mesh.name = "webcamMonitor";
      
      // add recorded video to the back pane/////////////////////////////////////////////////////////
       // Create an array to hold the recorded chunks
                let recordedChunks = [];

                    // Get the video element that will display the webcam feed
              const video = document.getElementById("webcam");

              // Create a MediaRecorder object to handle recording
              let mediaRecorder;

              // Get the webcam stream
              navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                  .then(stream => {
                      // Assign the stream to the video element
                      video.srcObject = stream;
                     
                  })
                  .catch(err => {
                      // Handle any errors
                      console.error("Error accessing webcam:", err);
                  });
// recording indicator
const recordIndicator = document.getElementById("recording-indicator");
 let isRecording = false; 
 
                    // To start recording
              function startRecording() {
                  isRecording = true;
                  recordIndicator.style.display = "block";
                  mediaRecorder = new MediaRecorder(video.srcObject);
                  mediaRecorder.ondataavailable = handleDataAvailable;
                  mediaRecorder.start();
                console.log(recordedChunks);
              }

              // To stop recording
              function stopRecording() {
                 isRecording = false;
                 recordIndicator.style.display = "none";        
                 mediaRecorder.stop();
                 console.log("stop record"+ isRecording);
              }
                    // Get the start and stop recording buttons
              const startButton = document.getElementById("start-recording");
              const stopButton = document.getElementById("stop-recording");

              // Add click event listeners to the buttons
              startButton.addEventListener("click", startRecording);
              stopButton.addEventListener("click", stopRecording);


var camCall =0;
function handleDataAvailable(event) {
  
  if (camCall<4){
  
  // Add the recorded chunk to the array
  recordedChunks.push(event.data);
  
  // create a blob
  const recordedBlob = new Blob(recordedChunks);

  // create url
  const url = URL.createObjectURL(recordedBlob);
  
      var clip = document.createElement('video');
      //clip.id ="clipGlitch";
      clip.src = url;//"https://cdn.glitch.global/5bd793e6-3c08-44e5-bec2-8b45b68b56c7/Vid%C3%A9o%20(1).mov?v=1674741746926";
      //clip.src ="https://drive.google.com/file/d/1z75maR3JAGz-kl34ILJC3_pGYzh9TdN4/preview"
      clip.crossOrigin="anonymous";
      document.getElementById('myCanvas').appendChild(clip);
      clip.width = 320;
      clip.height = 240;
      clip.autoplay = true;
      var clipTexture = new THREE.VideoTexture(clip);

      clipTexture.minfilter = THREE.linearFilter;
      clipTexture.magfilter = THREE.linearFilter;
    
      var movieMaterial = new THREE.MeshBasicMaterial({
        map:clipTexture,
        side:THREE.FrontSide,
        toneMapped:false,
        flipY:true
      });
      
      let movieGeometry = new THREE.PlaneGeometry(2.25,2);
      //let movieGeometry = new THREE.BoxGeometry(5,5,5)
      let movieScreen = new THREE.Mesh(movieGeometry,movieMaterial);
      movieScreen.position.set(-5,2,-3*camCall);
    movieScreen.rotateY((THREE.Math.degToRad(90)));
      scene.add(movieScreen);
    camCall++;
  }
          
}
//                 // Create an array to hold the recorded chunks
//                 let recordedChunks = [];

//                     // Get the video element that will display the webcam feed
//               const video = document.getElementById("webcam");

//               // Create a MediaRecorder object to handle recording
//               let mediaRecorder;

//               // Get the webcam stream
//               navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//                   .then(stream => {
//                       // Assign the stream to the video element
//                       video.srcObject = stream;
                     
//                   })
//                   .catch(err => {
//                       // Handle any errors
//                       console.error("Error accessing webcam:", err);
//                   });
// // recording indicator
// const recordIndicator = document.getElementById("recording-indicator");
//  let isRecording = false; 
 
//                     // To start recording
//               function startRecording() {
//                   isRecording = true;
//                   recordIndicator.style.display = "block";
//                   mediaRecorder = new MediaRecorder(video.srcObject);
//                   mediaRecorder.ondataavailable = handleDataAvailable;
//                   mediaRecorder.start();
//                 console.log(recordedChunks);
//               }

//               // To stop recording
//               function stopRecording() {
//                  isRecording = false;
//                  recordIndicator.style.display = "none";        
//                  mediaRecorder.stop();
//                  console.log("stop record"+ isRecording);
//               }
//                     // Get the start and stop recording buttons
//               const startButton = document.getElementById("start-recording");
//               const stopButton = document.getElementById("stop-recording");

//               // Add click event listeners to the buttons
//               startButton.addEventListener("click", startRecording);
//               stopButton.addEventListener("click", stopRecording);

// // Handle the dataavailable event
// function handleDataAvailable(event) {
//     // Add the recorded chunk to the array
//     recordedChunks.push(event.data);
//   console.log(event.data);

// // create a blob
// const recordedBlob = new Blob(recordedChunks);

// // create url
// const url = URL.createObjectURL(recordedBlob);

// // add the url to the video src
// video.src = url;
// const a = document.createElement("a");
// a.download = "record.webm";
// a.href = url;
// document.body.appendChild(a);
// a.click();
// }
