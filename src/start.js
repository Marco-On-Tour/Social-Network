import React from "react";
import ReactDOM from "react-dom";
import Register from "./register.js";

let userIsLoggedIn = location.pathname != "/welcome";

// Version 1
let componentToRender = <Welcome />;
if (userIsLoggedIn) {
    componentToRender = <div>Welcome back old friend.</div>;
}
ReactDOM.render(componentToRender, document.querySelector("main"));

// // Version 2
// if(userIsLoggedIn) {
//     ReactDOM.render(
//         <div>Welcome, old friend</div>,
//         document.querySelector('main')
//     );
// } else {
//     ReactDOM.render(
//         <Welcome />,
//         document.querySelector('main')
//     );
// }

function Welcome() {
    return (
        <div id="welcome">
            <h1>Something hedgehogs</h1>
            <Register />
        </div>
    );
}
