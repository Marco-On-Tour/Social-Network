import React from "react";
import axios from "./axios";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import Register from "./Register.js";

ReactDOM.render(
    <HelloWorld />,
    document.querySelector('main')
);

function Welcome() {
    return (
        <div>
            
            
            <h1>Finance Bros</h1>

            <HashRouter>
                            <Route path="/login" component={Login} />
                            <Route path="/" exact component={Register} />
                        </HashRouter>

        <footer>
            Copyright by Finance Bros
        </footer>

        </div>
    );
}
