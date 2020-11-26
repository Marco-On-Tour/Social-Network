import React from "react";
import ReactDOM from "react-dom";
import Register from "./register.js";
import App from "./app";
import axios from "axios";

async function loadUser() {
    try {
        const result = await axios.get("/api/users/me");
        return result.data;
    } catch (error) {
        const { data, status } = error.response;
        if (status != 404) {
            console.error(error);
        }
    }
}

async function init() {
    let user = await loadUser();
    console.log("initial load of user", user);

    var app = <App profile={user}/>;
    ReactDOM.render(app, document.querySelector("#app"));
    return app;
}

var app = init();
