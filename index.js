const express = require("express");
const app = express();
const compression = require("compression");
const bcrypt = require("./server/bcrypt");
const { decodeBase64 } = require("bcryptjs");
const db = require("./server/db");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const s3 = require("./server/s3");

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

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use("/api/upload/", uploader.single("file"), s3.upload, async function (req, resp){
    if(req.file){
        const filenName = req.file.filename;
        const { userId } = req.body;
        let user = await db.readUser(userId)
        const url = s3.getUrl(filenName);
        user.profilePic = url;
        user = await db.updateUser(user);
        return resp.json(user);
    }
});


app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await db.readUser(req.session.userId);
        req.user = user;
        return next();
    } else {
        return next();
    }
});

const router = require("./server/user");
app.use(router);

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
