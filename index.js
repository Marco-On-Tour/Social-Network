
const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require("cookie-session");
const csurf = require("csurf");

const apiRoutes = require("./api-routes.js");

//middleware:
app.use(compression());
app.use(express.json());
app.use("/public", express.static("./public"))


app.use(cookieSession({
    secret: "I don't have a secret",
    maxAge: 1000 *60 *60 * 24 * 31
}));

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

app.get('*', function(request, response) {

    // If the user is NOT logged in, they should not be here.
    if(!request.session.userId) {
        response.redirect(302, "/welcome");
    } else {
        response.sendFile(__dirname + '/index.html');
    }

});

app.listen(8080, function() {
    console.log("I'm listening.");
});