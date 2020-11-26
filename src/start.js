import React from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";

import Register from "./Register.js";
import Login from "./Login.js";
import PasswordReset from './PasswordReset.js';
import App from './App.js';

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer.js";
import { Provider } from "react-redux";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

import {init} from "./sockets.js";
init(store);

let userIsLoggedIn = location.pathname != '/welcome';

let componentToRender = <Welcome />;
if(userIsLoggedIn) {
    componentToRender =         
        (<Provider store={store}>
            <App />
        </Provider>);
    }
ReactDOM.render(componentToRender, document.querySelector("main"));

function Welcome() {
    return (
        <div>
            
            
            <h1>FinTank</h1>
   
            <HashRouter>
                <div>
                <Route exact path="/" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/reset/password" component={PasswordReset} />
                </div>
            </HashRouter>

       

        </div>
    );
}
