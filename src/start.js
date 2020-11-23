import React from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";

import Register from "./Register.js";
import Login from "./Login.js";
import PasswordReset from './PasswordReset.js';

let userIsLoggedIn = location.pathname != '/welcome';

let componentToRender = <Welcome />;
if(userIsLoggedIn) {
    componentToRender = (<div>Nice to have you back.</div>);
}
ReactDOM.render(componentToRender, document.querySelector("main"));

function Welcome() {
    return (
        <div id= "welcome">
            <header>
            
            <h1>FinTank</h1>

            </header>
            <HashRouter>
                <Route path="/" exact component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/PasswordReset" component={PasswordReset} />
            </HashRouter>

        <footer>
            Copyright by FinTank
        </footer>

        </div>
    );
}
