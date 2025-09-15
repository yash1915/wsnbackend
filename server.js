require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');  // <-- import cors

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// --- CORS Middleware ---
app.use(cors({
    origin: 'https://wsnfrontend.netlify.app',  // allow only this frontend
    methods: ['GET', 'POST'],
    credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// WebSocket Connection
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to broadcast data to all clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes(broadcast));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
