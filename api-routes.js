const express = require("express");
const router = new express.Router();
const passwords = require("./passwords.js");
const db = require("./db.js");
const { request, response } = require("express");


//adding new user

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

//user login

router.post("/api/login", (req, res) => {
    const {email, password} = req.body;

    db.getUserByEmail(email)
    .then((user) => {
        passwords.compare(password, user.password_hash)
        .then((passwordMatches) => {
            if (passwordMatches) {
                request.session.userId = user.id;
                response.json({
                    success: true,
                });
            } else {
                response.json({
                    success: false,
                    error: "Account does not exist or incorrect password",
                });
            }
        });
    })
    .catch((e) => {
        console.log(e);
        response.json({
            success: false,
            error: "Account does not exist or incorrect password",
        });
    });
});

module.exports = router;