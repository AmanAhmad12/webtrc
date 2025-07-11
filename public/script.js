// // DOM Elements
// require('dotenv').config();

// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');
// const startBtn = document.getElementById('startBtn');
// const callBtn = document.getElementById('callBtn');
// const hangupBtn = document.getElementById('hangupBtn');
// const acceptBtn = document.getElementById('acceptBtn');
// const rejectBtn = document.getElementById('rejectBtn');
// const incomingCallDiv = document.getElementById('incomingCall');

// // WebRTC Variables
// let localStream;
// let pc;
// let currentOffer = null;  
// const socket = io();

// // Twilio ICE servers configuration
// const iceServers = [
//   { urls: 'stun:global.stun.twilio.com:3478' },
//   { 
//     urls: 'turn:global.turn.twilio.com:3478?transport=udp',
//     username: process.env.ACCOUNT_USERNAME,  
//     credential: process.env.ACCOUNT_CRED
//   }
// ];

// // Set up signaling listeners IMMEDIATELY
// socket.on('offer', handleIncomingOffer);
// socket.on('answer', handleAnswer);
// socket.on('candidate', handleCandidate);

// // 1. Start Camera
// startBtn.onclick = async () => {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({ 
//       video: { width: 1280, height: 720 },
//       audio: true 
//     });
//     localVideo.srcObject = localStream;
//     callBtn.disabled = false;
//     startBtn.disabled = true;
//   } catch (err) {
//     console.error("Camera error:", err);
//     alert("Could not access camera/microphone. Please check permissions.");
//   }
// };

// // 2. Start Call (Caller)
// callBtn.onclick = () => {
//   pc = new RTCPeerConnection({ iceServers });
//   hangupBtn.disabled = false;
//   callBtn.disabled = true;
  
//   // Add local stream to connection
//   localStream.getTracks().forEach(track => {
//     pc.addTrack(track, localStream);
//   });
  
//   // Setup remote stream
//   pc.ontrack = event => {
//     remoteVideo.srcObject = event.streams[0];
//   };
  
//   // Exchange ICE candidates
//   pc.onicecandidate = ({ candidate }) => {
//     if (candidate) {
//       console.log(candidate);
//       socket.emit('candidate', candidate);
//     }
//   };
  
//   // Create and send offer
//   pc.createOffer()
//     .then(offer => pc.setLocalDescription(offer))
//     .then(() => {
//       socket.emit('offer', pc.localDescription);
//     })
//     .catch(err => console.error("Offer error:", err));
// };

// // 3. Handle incoming offer (Callee)
// function handleIncomingOffer(offer) {
  
//   currentOffer = offer;
//   incomingCallDiv.classList.remove('hidden');
// }

// // 4. Accept incoming call (Callee)
// acceptBtn.onclick = async () => {
//   if (!currentOffer) return;
  
//   // Hide incoming call UI
//   incomingCallDiv.classList.add('hidden');
  
//   // Start camera if not already started
//   if (!localStream) {
//     try {
//       localStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 1280, height: 720 },
//         audio: true 
//       });
//       localVideo.srcObject = localStream;
//       startBtn.disabled = true;
//     } catch (err) {
//       console.error("Camera error:", err);
//       alert("Could not start camera for the call");
//       return;
//     }
//   }
  
//   // Create peer connection
//   pc = new RTCPeerConnection({ iceServers });
//   hangupBtn.disabled = false;
  
//   // Add local media
//   localStream.getTracks().forEach(track => {
//     pc.addTrack(track, localStream);
//   });
  
//   // Setup handlers
//   pc.ontrack = event => {
//     remoteVideo.srcObject = event.streams[0];
//   };
  
//   pc.onicecandidate = ({ candidate }) => {
//     candidate && socket.emit('candidate', candidate);
//   };
  
//   // Process the offer
//   try {
//     await pc.setRemoteDescription(currentOffer);
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     socket.emit('answer', answer);
//   } catch (err) {
//     console.error("Answer error:", err);
//   }
  
//   currentOffer = null;
// };

// // 5. Reject incoming call
// rejectBtn.onclick = () => {
//   currentOffer = null;
//   incomingCallDiv.classList.add('hidden');
// };

// // 6. Handle answer (Caller)
// function handleAnswer(answer) {
//   if (pc) {
//     pc.setRemoteDescription(answer);
//   }
// }

// // 7. Handle ICE candidates
// function handleCandidate(candidate) {
//   if (pc) {
//     pc.addIceCandidate(new RTCIceCandidate(candidate));
//   }
// }

// // 8. End Call
// hangupBtn.onclick = () => {
//   // Close peer connection
//   if (pc) {
//     pc.close();
//     pc = null;
//   }
  
//   // Stop remote video
//   remoteVideo.srcObject = null;
  
//   // Stop local tracks and reset camera
//   if (localStream) {
//     localStream.getTracks().forEach(track => {
//       track.stop(); // This releases the camera/mic
//     });
//     localStream = null;
//     localVideo.srcObject = null; // Clear local video
//   }
  
//   // Reset UI state
//   hangupBtn.disabled = true;
//   callBtn.disabled = true;
//   startBtn.disabled = false; // Allow restarting camera
  
//   // Reset call UI
//   incomingCallDiv.classList.add('hidden');
//   currentOffer = null;
// };

// // Cleanup on page close
// window.onbeforeunload = () => {
//   socket.disconnect();
//   if (pc) pc.close();
// };




// // DOM Elements
// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');
// const startBtn = document.getElementById('startBtn');
// const callBtn = document.getElementById('callBtn');
// const hangupBtn = document.getElementById('hangupBtn');
// const acceptBtn = document.getElementById('acceptBtn');
// const rejectBtn = document.getElementById('rejectBtn');
// const incomingCallDiv = document.getElementById('incomingCall');

// // WebRTC Variables
// let localStream;
// let pc;
// let currentOffer = null;
// const socket = io();
// let iceServers = [];

// // 0. Fetch ICE servers dynamically
// async function fetchIceServers() {
//   try {
//     const response = await fetch('/ice-config');
//     const data = await response.json();
//     iceServers = data.iceServers;
//     console.log('Fetched ICE servers:', iceServers);
//   } catch (error) {
//     console.error("Failed to fetch ICE servers:", error);
//   }
// }

// // Set up signaling listeners IMMEDIATELY
// socket.on('offer', handleIncomingOffer);
// socket.on('answer', handleAnswer);
// socket.on('candidate', handleCandidate);

// // 1. Start Camera
// startBtn.onclick = async () => {
//   try {
//     localStream = await navigator.mediaDevices.getUserMedia({ 
//       video: { width: 1280, height: 720 },
//       audio: true 
//     });
//     localVideo.srcObject = localStream;
//     callBtn.disabled = false;
//     startBtn.disabled = true;
//   } catch (err) {
//     console.error("Camera error:", err);
//     alert("Could not access camera/microphone. Please check permissions.");
//   }
// };

// // 2. Start Call (Caller)
// callBtn.onclick = async () => {
//   await fetchIceServers();
//   pc = new RTCPeerConnection({ iceServers });

//   hangupBtn.disabled = false;
//   callBtn.disabled = true;

//   localStream.getTracks().forEach(track => {
//     pc.addTrack(track, localStream);
//   });

//   pc.ontrack = event => {
//     remoteVideo.srcObject = event.streams[0];
//   };

//   pc.onicecandidate = ({ candidate }) => {
//     if (candidate) {
//       socket.emit('candidate', candidate);
//     }
//   };

//   try {
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit('offer', pc.localDescription);
//   } catch (err) {
//     console.error("Offer error:", err);
//   }
// };

// // 3. Handle incoming offer (Callee)
// function handleIncomingOffer(offer) {
//   currentOffer = offer;
//   incomingCallDiv.classList.remove('hidden');
// }

// // 4. Accept incoming call (Callee)
// acceptBtn.onclick = async () => {
//   if (!currentOffer) return;
//   incomingCallDiv.classList.add('hidden');

//   if (!localStream) {
//     try {
//       localStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 1280, height: 720 },
//         audio: true 
//       });
//       localVideo.srcObject = localStream;
//       startBtn.disabled = true;
//     } catch (err) {
//       console.error("Camera error:", err);
//       alert("Could not start camera for the call");
//       return;
//     }
//   }

//   await fetchIceServers();
//   pc = new RTCPeerConnection({ iceServers });
//   hangupBtn.disabled = false;

//   localStream.getTracks().forEach(track => {
//     pc.addTrack(track, localStream);
//   });

//   pc.ontrack = event => {
//     remoteVideo.srcObject = event.streams[0];
//   };

//   pc.onicecandidate = ({ candidate }) => {
//     candidate && socket.emit('candidate', candidate);
//   };

//   try {
//     await pc.setRemoteDescription(currentOffer);
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     socket.emit('answer', answer);
//   } catch (err) {
//     console.error("Answer error:", err);
//   }

//   currentOffer = null;
// };

// // 5. Reject incoming call
// rejectBtn.onclick = () => {
//   currentOffer = null;
//   incomingCallDiv.classList.add('hidden');
// };

// // 6. Handle answer (Caller)
// function handleAnswer(answer) {
//   if (pc) {
//     pc.setRemoteDescription(answer);
//   }
// }

// // 7. Handle ICE candidates
// function handleCandidate(candidate) {
//   if (pc) {
//     pc.addIceCandidate(new RTCIceCandidate(candidate));
//   }
// }

// // 8. End Call
// hangupBtn.onclick = () => {
//   if (pc) {
//     pc.close();
//     pc = null;
//   }

//   remoteVideo.srcObject = null;

//   if (localStream) {
//     localStream.getTracks().forEach(track => track.stop());
//     localStream = null;
//     localVideo.srcObject = null;
//   }

//   hangupBtn.disabled = true;
//   callBtn.disabled = true;
//   startBtn.disabled = false;
//   incomingCallDiv.classList.add('hidden');
//   currentOffer = null;
// };

// // Cleanup on page close
// window.onbeforeunload = () => {
//   socket.disconnect();
//   if (pc) pc.close();
// };



// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or your Vercel domain
    methods: ["GET", "POST"]
  }
});

app.use(cors());

app.get('/ice-config', (req, res) => {
  res.json({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
