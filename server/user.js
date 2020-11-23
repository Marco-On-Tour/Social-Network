const express = require("express");
const compression = require("compression");
const bcrypt = require("./bcrypt");
const { decodeBase64 } = require("bcryptjs");
const db = require("./db");
// const cookieSession = require("cookie-session");
// const bodyParser = require("body-parser");
const cryptoRandomString = require("crypto-random-string");

const router = express.Router()
module.exports = router;


router.post("/api/users/register-user", async (req, resp) => {
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
    } catch (error) {
        resp.status(500).send(error);
    }
});

router.post("/api/users/login", async (req, resp) => {
    const { email, password } = req.body;
    const user = await db.readByEmail(email);
    try {
        if (user && bcrypt.compare(password, user.passwordHash)) {
            req.session.userId = user.id;
            return resp.json(user);
        } else {
            resp.statusMessage = `user with email ${email} does not exist or password doesn't match`;
            return resp.status(404);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
});

router.get("/api/users/me", async (req, resp) => {
    if (req.user) {
        const user = resp.json(req.user);
        user.passwordHash = undefined;
        return user;
    } else {
        return resp.status(404).send("user not found");
    }
});

router.get("/api/users/:id", async (req, resp) => {
    try {
        const user = await db.readUser(req.params.id);
        if (user) {
            user.passwordHash = undefined; // client doens't need hash
            return resp.json(user);
        } else {
            return resp.status(404).send("user not found");
        }
    } catch (error) {
        console.error("could not load user with id " + req.params.id, error);
        throw error;
    }
});

router.post("/api/users/request-password-reset", async (req, resp) => {
    const { email } = req.body;
    if (email) {
        const random = cryptoRandomString({ length: 6 });
        await db.resetPasswordRequest(email, random);
        console.log("created password reset secret " + random);
        return resp.sendStatus(200);
    } else {
        return resp.status(400).send("missing email");
    }
});

router.post("/api/users/reset-password", async (req, resp) => {
    try {
        const { email, secret, newPassword } = req.body;
        const newHash = bcrypt.hash(newPassword);
        let user = await db.resetPassword(email, secret, newHash);
        req.session.userId = user.id;
        return resp.sendStatus(200);
    } catch (error) {
        console.error(error);
        return resp.status(400).send(error);
    }
});

router.post("/api/users/profile-pic", async (req,resp) => {
    const { userId, url } = req.body;
    const user = await db.readUser(userId);
    user.profilePic = url;
    await db.updateUser(user);
    return  resp.sendStatus(200);
});