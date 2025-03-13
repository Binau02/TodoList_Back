// modules
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require("express-session");
const { Server } = require("socket.io");
const http = require('http');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = 3000;



// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));

app.use('/images', express.static(path.join(__dirname, 'images')));


/*// middleware d'authentification
var requiredPage = null

function auth(req, res, next) {
    if (req?.session?.user) {
        return next();
    }
    else {
        // return res.sendStatus(401);
        requiredPage = req.baseUrl
        res.redirect("/login")
    }
}

// middleware de redirection après le login
function redirect(req, res, next) {
    if (requiredPage != null) {
        res.redirect(requiredPage)
        requiredPage = null
        return
    }
    res.redirect("/home")
}*/




/*// setup routes
const routers = ["login", "logout", "home", "profile", "event", "messages", "api"]

routers.forEach(router => {
    switch(router) {
        case "login":
            app.use("/" + router, require("./routes/" + router + ".js"))
            break;
        case "api":
            app.use("/" + router, require("./routes/" + router + ".js"))
            break;
        default:
            app.use("/" + router, auth, require("./routes/" + router + ".js"))
    }
})*/



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