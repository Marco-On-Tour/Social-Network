import React from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route } from "react-router-dom";

import Register from "./Register.js";

let userIsLoggedIn = location.pathname != '/welcome';

let componentToRender = <Welcome />;
if(userIsLoggedIn) {
    componentToRender = (<div>Nice to have you back.</div>);
}
ReactDOM.render(componentToRender, document.querySelector("main"));

function Welcome() {
    return (
        <div id="welcome">
            <header>
            
            <h1>FinTank</h1>

            </header>
            <HashRouter>
                            <Route path="/" exact component={Register} />
                        </HashRouter>

        <footer>
            Copyright by FinTank
        </footer>

        </div>
    );
}
