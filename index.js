const express = require("express");
const app = express();
const compression = require("compression");
const bcrypt = require("./server/bcrypt");
const { decodeBase64 } = require("bcryptjs");
const db = require("./server/db");
const cookieSession = require("cookie-session");

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

app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await db.readUser(req.session.userId);
        req.user = user;
        return next();
    } else {
        return next();
    }
});

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/api/register-user", async (req, resp) => {
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = bcrypt.hash(password);
    const user = await db.createuser({
        firstName,
        lastName,
        email,
        passwordHash,
    });
    return resp.json(user);
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

app.listen(8080, function () {
    console.log("I'm listening.");
});
