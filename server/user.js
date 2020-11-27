const express = require("express");
const compression = require("compression");
const bcrypt = require("./bcrypt");
const { decodeBase64 } = require("bcryptjs");
const db = require("./db");
// const cookieSession = require("cookie-session");
// const bodyParser = require("body-parser");
const cryptoRandomString = require("crypto-random-string");
const { json } = require("body-parser");

const router = express.Router()
module.exports = router;

router.get("/api/users", async (req,resp) => {
    try {
        const {query} = req.query;
        const result = await db.listUsers(query);
        return resp.json(result);
    } catch(error) {
        console.error(error);
        return resp.sendStatus(500);
    }
});

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
            resp.status(404).send(`user with email ${email} does not exist or password doesn't match`);
        }
    } catch (error) {
        console.error(error);
        return resp.sendStatus(500);
    }
});

router.get("/api/users/logout", (req, resp) => {
    req.session = null;
    return resp.redirect("/"); 
});

router.get("/api/users/me", async (req, resp) => {
    if (req.user) {
        const user = resp.json(req.user);
         /* make really, really sure that hash doesn't leak out*/
        user.passwordHash = undefined;
        const friends = await db.readFriendships(req.user.id);
        user.friends = friends;
        return user;
    } else {
        return resp.status(404).send("user not found");
    }
});

router.get("/api/users/:id", async (req, resp) => {
    try {
        const user = await db.readUser(req.params.id);
        if (user) {
            /* make really, really sure that hash doesn't leak out*/
            user.passwordHash = undefined; // client doens't need hash
            return resp.json(user);
        } else {
            return resp.status(404).send("user not found");
        }
    } catch (error) {
        console.error("could not load user with id " + req.params.id, error);
        return resp.sendStatus(500);
    }
});

router.post("/api/users/request-password-reset", async (req, resp) => {
    const { email } = req.body;
    try{
        if (email) {
            const random = cryptoRandomString({ length: 6 });
            await db.resetPasswordRequest(email, random);
            console.log("created password reset secret " + random);
            return resp.sendStatus(200);
        } else {
            return resp.status(400).send("missing email");
        }
    } catch(error){
        console.error(error);
        return resp.sendStatus(500);
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
    try {
        const { userId, url } = req.body;
        const user = await db.readUser(userId);
        user.profilePic = url;
        await db.updateUser(user);
        return  resp.sendStatus(200);
    } catch(error) {
        console.error(error);
        return resp.sendStatus(500);
    }
});

router.post("/api/users/me/bio", async (req, resp) => {
   try {
       let user = req.user;
       const {bio} = req.body;
       user.bio = bio;
       user = await db.updateUser(user);
       return resp.json(user);
   } catch(error) {
       console.error(error);
       return resp.sendStatus(500);
   }
});

router.get("/api/users/me/friends", async (req, resp) => {
    const friends = await db.readFriendships(req.user.id);
    return resp.json(friends);
});

router.post("/api/users/me/friends/:friendId", async (req,resp) => {
    await db.createFriendship(req.user.id, req.params.friendId);
    resp.json(await db.readFriendships(req.user.id));
});

router.delete("/api/users/me/friends/:friendId", async (req,resp) => {
    await db.deleteFriendship(req.user.id, req.params.friendId);
    resp.json(await db.readFriendships(req.user.id));
});

router.get("/api/users/friends-status/:friendId", async (req,resp) => {
    try {
        const myId = req.user.id;
        const friendId = Number(req.params.friendId);
        const myFriends = await db.readFriendships(myId);
        const theirFriends = await db.readFriendships(friendId);
        const isMyFriend = myFriends.some((f) => f.id === friendId);
        const amTheirFriend = theirFriends.some((f) => f.id === myId);

        if (isMyFriend && amTheirFriend) {
            return resp.json("MUTUAL_FRIENDSHIP");
        } else if (isMyFriend && !amTheirFriend) {
            return resp.json("FRIENDSHIP_REQUESTED_BY_ME");
        } else if (!isMyFriend && amTheirFriend) {
            return resp.json("FRIENDHIP_REQUESTED_BY_THEM");
        } else {
            return resp.json("NO_FRIENDSHIP");
        }
    } catch (error) {
        console.error(error);
        return resp.sendStatus(500);
    }
})