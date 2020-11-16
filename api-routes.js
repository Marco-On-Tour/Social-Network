const express = require("express");
const router = new express.Router();
const passwords = require("./passwords.js");
const db = require("./db.js");

router.post("/api/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    passwords
        .hash(password)
        .then((password_hash) =>
            db.addUser(firstname, lastname, email, password_hash)
        )
        .then((newUser) => {
            req.session.userId = newUser.id;

            res.json({
                success: true,
                user: newUser,
            });
        })
        .catch((e) => {
            console.log(e);
            res.json({
                success: false,
                error: "Please fill out all fields.",
            });
        });
});