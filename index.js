const express = require("express");
const app = express();
const compression = require("compression");
const bcrypt = require("./server/bcrypt");
const { decodeBase64 } = require("bcryptjs");
const db = require("./server/db");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
app.use(compression());
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await db.readUser(req.session.userId);
        req.user = user;
        return next();
    } else {
        return next();
    }
});


app.post("/api/register-user", async (req, resp) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = bcrypt.hash(password);
        const user = await db.createuser({
            firstName,
            lastName,
            email,
            passwordHash,
        });
        req.session.userId = user.id;
        return resp.json(user);
    } catch(error){
        resp.status(500).send(error);
    }
});

app.post("/api/login", async (req, resp) => {
    const { email, password } = req.body;
    const user = await db.readByEmail(email);
    if (user && bcrypt.compare(password, user.passwordHash)) {
        req.session.userId = user.id;
        return resp.json(user);
    } else {
        resp.statusMessage = `user with email ${email} does not exist or password doesn't match`;
        return resp.status(404);
    }
});

app.get("/api/users/:id", async (req, resp)=> {
    try {
        const user = await db.readUser(req.params.id);
        if (user){
            user.passwordHash = undefined; // client doens't need hash
            return resp.json(user);
        } else {
            return resp.status(404).send("user not found");
        }
    } catch(error){
        console.error("could not load user with id "+ req.params.id, error);
        throw error;
    }
    
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
