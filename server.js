// require('dotenv').config();

// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// // Serve static files
// app.use(express.static('public'));

// // Socket.io signaling
// io.on('connection', socket => {
//   console.log('User connected:', socket.id);
  
//   // Relay signaling data to other peer
//   const relay = (event) => {
//     socket.on(event, data => {
//       socket.broadcast.emit(event, data);
//     });
//   };
//   // Set up relay for WebRTC signals
//   relay('offer');
//   relay('answer');
//   relay('candidate');
  
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });


// server.listen(3000, () => {
//   console.log(`Server running on http://localhost:${3000}`);
// });

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config(); // Load .env

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Twilio credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Serve static files
app.use(express.static('public'));

// Endpoint to provide ICE server config
app.get('/ice-config', async (req, res) => {
  try {
    const token = await client.tokens.create({ ttl: 3600 });
    res.json({ iceServers: token.iceServers });
  } catch (err) {
    console.error('ICE fetch error:', err.message);
    res.status(500).json({ error: 'Could not fetch ICE servers' });
  }
});

// Socket.io signaling
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  const relay = event => {
    socket.on(event, data => {
      socket.broadcast.emit(event, data);
    });
  };

  relay('offer');
  relay('answer');
  relay('candidate');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
