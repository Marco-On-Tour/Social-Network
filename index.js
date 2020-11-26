


const express = require('express');
const app = express();
const server = require('http').Server(app);

const compression = require('compression');
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const io = require('socket.io')(server, { origins: 'localhost:8080' });

const apiRoutes = require("./api-routes.js");
const db = require("./db.js");

//middleware:
app.use(compression());
app.use(express.json());
app.use("/public", express.static("./public"));
app.use("/user-pics", express.static("./user-pics"));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


app.use(csurf());
app.use((request, response, next) => {
    response.cookie("mytoken", request.csrfToken());
    next();
});

app.use((request, response, next) => {
    console.log("🃏", request.url, request.session);
    next();
});

//app.use(compression());

//const apiRoutes = require("./api-routes.js");
app.use(apiRoutes);





if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}



app.get("/welcome", (request, response) => {

    // If the user is logged in, they should not be here.
    if(request.session.userId) {
        response.redirect(302, "/");
    } else {
        response.sendFile(__dirname + '/index.html');
    }

});

app.get('*', (request, response) => {

    // If the user is NOT logged in, they should not be here.
    if(!request.session.userId) {
        response.redirect(302, "/welcome");
    } else {
        response.sendFile(__dirname + '/index.html');
    }

});

io.on('connection',  async function(socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    console.log("socket is connected with userId: ", userId);

    const messages = await db.getChatMessages();

    // send messages to browser:
    socket.emit("chatMessages", messages);

    socket.on("newMessage", async(messageText) => {

        console.log("new message received: ", messageText);

        const {id} = await db.addChatMessage(userId, messageText);
        const user = await db.getOtherUsersById(userId);

        io.sockets.emit("chatMessage", {
            message_id: id,
            message_text: messageText,
            ...user
        });

        console.log("user from socket.io", user);

    });
 
});


server.listen(8080, function() {
    console.log("I'm listening.");
});