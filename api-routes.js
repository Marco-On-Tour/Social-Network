const express = require("express");
const router = new express.Router();
const passwords = require("./passwords.js");
const db = require("./db.js");
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
//const { request, response } = require("express");
const cryptoRandomString = require('crypto-random-string');
const secretCode = cryptoRandomString({
    length: 6
});

const ses = require("./ses.js");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/user-pics');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});


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
    const { email, password } = req.body;

    db.getUserByEmail(email)
        .then((user) => {
            passwords
                .compare(password, user.password_hash)
                .then((passwordMatches) => {
                    if (passwordMatches) {
                        req.session.userId = user.id;
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({
                            error:
                                " Your password is wrong or the user does not exist. Try again.",
                        });
                    }
                });
        })
        .catch((e) => {
            console.log(e);
            res.json({
                success: false,
                error:
                    "Your password is wrong or the user does not exist. Try again.",
            });
        });
});


//validation code routing
router.post("/api/reset/start", (req, res) => {
    const { email } = req.body;

    db.getUserByEmail(email)
    .then((user) => {
        console.log("user", user);
        if(!user) {
            console.log("No such user")
            return res.json({
                error: "No such user", 
                success: false
            });
        }
            const userId = user.id;
            console.log("secret-code", secretCode);
            db.addSecretCode(userId, secretCode)
            .then((result) => {
                console.log("secret key", result);
                ses.send(email, secretCode);
                return res.json({
                    success: true
                });
            });
    });
});

//password reset

router.post("/api/reset/password", (req, res) => {
    const {email, newPassword, secretCode} = req.body;
    db.getUserByEmail(email)
    .then((user) => {
        if(!user) {
            return res.json({
                error: "Does not exist",
                success: false
            });
        }

        db.getUsersSecretCode()
        .then((result) => {
            if(result.secretcode == code) {
                passwords
                .hash
                .then((password_hash) => {
                    const userId = user.id;
                    dbupdateUserPassword(userId, password_hash)
                    .then(() => {
                        return res.json({
                            success: true
                        });
                    })
                })
            } else {
                return response.json({
                    error: "Incorrect code",
                    success: false
                });
            }
        });
    });

    
});

//profile picture

router.post("/api/fileupload", uploader.single('file'), (req, res) => {

    if(!req.session.userId) {
        console.log("User is not logged in");
        return res.json({
            error: "User is not logged in."
        });
    }

    console.log("req.file", req.file);
    const newProfilePic = `/user-pics/${req.file.filename}`;
    const userId = req.session.userId;
    db.uploadUserPic(userId, newProfilePic)
    .then(updatedUser => {
        console.log("result from uploaduser", updatedUser);
        return res.json({
            success: true,
            updatedUser,
        });
    })
    .catch((e) => {
        console.log(e);
        res.json({
            success: false,
            error:
                "Something went wrong with the upload.",
        });
    });
});

//update bio

router.post("/api/updatebio", (req, res) => {

    const userId = req.session.userId;
    const {bioEdit} = req.body;

     db.updateUserBio(userId, bioEdit)
    .then(updatedUser => {
        return res.json({
            success: true,
            updatedUser,
        });
    }) 
});

//Find other users
router.get("/api/user/:id", (req, res) => {

    const currentUserId = req.params.id;
    const itsMe = req.params.id == req.session.userId;
    console.log("req.params.id", req.params.id, currentUserId)
    console.log("itsMe", itsMe)

    db.getOtherUsersById(currentUserId)
    .then(user => {
        console.log("result user", user);
        if(!user) {
            res.json({
                success: false,
                error: "User does not exist."
            })
        } else {
            return res.json({
                success: true,
                user,
                itsMe,
            })
        }
    })
})

//Find user profile

router.get("/api/user", (req, res) => {
    const userId = req.session.userId;
    db.getUserById(userId)
    .then((user) => {
        console.log("get user data by id", user);
        return res.json(user);
    }) 
})

//Query user search
router.get("/api/find-user/:query", (req, res) => {

    const userQuery = req.params.query;
    

    db.getUserListByQuery(userQuery)
    .then(user => {
        
        if(!user) {
            res.json({
                success: false,
                error: "User does not exist."
            })
        } else {
            return res.json({
                success: true,
                user,
            })
        }
    })
})

// friend status button
const noFriendRequest = "no_friend_request"
const acceptedFriendRequest = "friend_request_accepted"
const madeByMeFriendRequest = "friend_request_made_by_me"
const madeToMeFriendRequest = "friend_request_made_to_me"


router.get("/api/friend-status/:otherUsersId", (req, res) => {
    
    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;
    

    db.getFriendRequestStatus(itsMe, otherUsersId)
        .then(friendRequestStatus => {

            console.log("friend request status", friendRequestStatus);

        if(!friendRequestStatus) {
            return res.json({
                status: noFriendRequest
            });
        }
    
        if(friendRequestStatus.accepted) {
            return res.json({
                status: acceptedFriendRequest
            });
        }

        if(friendRequestStatus.from_id == itsMe) {
            return res.json({
                status: madeByMeFriendRequest
            });
        }

        if(friendRequestStatus.to_id == itsMe && friendRequestStatus.accepted == false) {
            return res.json({
                status: madeToMeFriendRequest
            });
        }
    })
})

// Friend request routing
router.post("/api/friend-status/make-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.makeFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: madeByMeFriendRequest
            });
        }); 

});

router.post("/api/friend-status/accept-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.acceptFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: acceptedFriendRequest
            });
        });

});

router.post("/api/friend-status/cancel-request/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.cancelFriendRequest(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: noFriendRequest
            });
        });

});

router.post("/api/friend-status/unfriend/:otherUsersId", (req, res) => {

    const {otherUsersId} = req.params;
    const itsMe = req.session.userId;

    db.unfriendUser(itsMe, otherUsersId)
        .then(result => {
            return res.json({
                status: noFriendRequest
            });
        });

});

//friends list with friends status
router.get("/api/friends", (req, res) => {

    const itsMe = req.session.userId;

    db.getFriendsAsList(itsMe)
        .then(friendList => {
            return res.json({
                friendList
            });
        });

});



module.exports = router;