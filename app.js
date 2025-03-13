// modules
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const {Server} = require("socket.io");
const http = require('http');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

// Initialisation de la base de données
require('./initializeDatabase');

const authRouter = require('./route/auth.js');

const app = express();
const port = 3000;

dotenv.config();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));


app.use('/auth', authRouter);

// messages
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log(`New connection. Socket id : ${socket.id}`);
});

// server start
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
