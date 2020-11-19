import React from "react";
import ReactDOM from "react-dom";
import Register from "./register.js";
import App from "./app";

// // https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
// function getCookieValue(a) {
//     var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
//     return b ? b.pop() : '';
// }

// // let userIsLoggedIn = false;
// // if (if(localStorage)){
// //     userIsLoggedIn = true;
// // }

// // Version 1
// let componentToRender = <Welcome />;
// if (userIsLoggedIn) {
//     componentToRender = <div>Welcome back old friend.</div>;
// }
// ReactDOM.render(componentToRender, document.querySelector("main"));

// function Welcome() {
//     return (
//         <div id="welcome">
//             <h1>Something hedgehogs</h1>
//             <Register />
//         </div>
//     );
// }
var app = <App />;
ReactDOM.render(app, document.querySelector("main"));
