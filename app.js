// modules
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require("express-session");
const {Server} = require("socket.io");
const http = require('http');
const cors = require('cors');
const bodyParser = require("body-parser");
const initializeDatabase = require("./initializeDatabase");

const app = express();
const port = 3000;

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/images', express.static(path.join(__dirname, 'images')));

// messages (socket.io)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log(`New connection. Socket id : ${socket.id}`);
});

// Initialisation de la base de données avant de démarrer le serveur
initializeDatabase((err, db) => {
    if (err) {
        console.error("Database initialization failed. Server not started.");
        process.exit(1); // Arrêter le serveur en cas d'erreur
    } else {
        console.log("Database initialized successfully.");
        server.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }
});
