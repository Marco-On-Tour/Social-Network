import React from "react";
import ReactDOM from "react-dom";
import Register from "./register.js";
import App from "./app";
import axios from "axios";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxPromise from "redux-promise";
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
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

    var app = (
        <Provider store={store}>
            <App profile={user} />
        </Provider>
    );
    ReactDOM.render(app, document.querySelector("#app"));
    return app;
}


var app = init();
