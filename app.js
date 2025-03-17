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
const {verifyToken} = require("./middleware/authMiddleware");

// Initialisation de la base de données
require('./initializeDatabase');

const authRouter = require('./route/auth.js');
const userRouter = require('./route/user.js');
const listRouter = require('./route/list.js');
const listItemRouter = require('./route/list_item.js');
const { getAllItemsOfList, updateListItem } = require('./service/listItemService.js');

const app = express();
const port = 3000;

dotenv.config();

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:8080'],
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));


app.use('/auth', authRouter);
app.use('/users', verifyToken, userRouter);
app.use('/lists', verifyToken, listRouter);
app.use('/list', verifyToken, listItemRouter);

// messages
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    console.log(`New connection. Socket id : ${socket.id}`);

    socket.on("enterList", async (listId) => {
        for (const room of socket.rooms) {
            if (room !== socket.id) {
                socket.leave(room);
            }
        }
        socket.join(listId)
    })

    socket.on("moveTaskItem", async (data) => {
        // console.log(data)
        let tasks = await getAllItemsOfList(data.id)
        // console.log(tasks)
        tasks[data.previousIndex].position = data.currentIndex
        if (data.currentIndex > data.previousIndex) {
            for (let i = data.previousIndex + 1; i <= data.currentIndex; i++) {
                tasks[i].position -= 1
            }
        }
        else {
            for (let i = data.currentIndex; i < data.previousIndex; i++) {
                tasks[i].position += 1
            }
        }
        // console.log(tasks)
        tasks.forEach(task => {
            updateListItem(task.id, task.completed_by, task.position, task.name)
        });
        io.to(data.id).emit("moveTaskItem", data)
    })

    socket.on("checked", async (data) => {
        io.to(data.id).emit("checked", data)
    })
    
    socket.on("grantAccess", async (data) => {
        // send to access granted user
    })

    socket.on("removeAccess", async (data) => {
        // send to access removed user
    })

    socket.on("addTask", async (data) => {
        io.to(data.id).emit("addTask", data)
    })
});

// server start
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
