import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Register from "./register";
import { BrowserRouter as Router, HashRouter, Link, Route, useHistory, generatePath } from "react-router-dom";
import Login from "./login";
import PasswordResetRequest from "./password-reset-request";
import PasswordReset from "./password-reset";

export default class App extends React.Component {
    constructor() {
        console.log("app created");
        super();
        this.state = {
            user: null,
            modalOpen: false,
        };
    }
    async componentDidMount() {
        console.log("componentDidMount");
        await this.loadUser();
    }

    async loadUser() {
        console.log("loading user");
        try {
            const result = await axios.get("/api/users/me");
            console.log(result.data);
            this.setState({
                user: result.data,
            });
        } catch (error) {
            console.log(error);
        }
    }

    onUserLoaded(user) {
        this.setState({user:user});
        console.log("user is loaded", user);
        window.location = generatePath("/");
    }


    render() {
        return (
            <HashRouter hashType="noslash">
                <div>
                    <Route exact path="/login">
                        <Login onLogin={event => this.onUserLoaded(event.user)} />
                        <p>Forgot your password? <Link to="/request-password-reset">Reset it!</Link></p>
                    </Route>
                    <Route path="/register">
                        <Register />
                        <p>
                            Got an account? <Link to="/login">login</Link>
                        </p>
                    </Route>
                    <Route path="/request-password-reset"  onPasswordResetRequested={(e) => window.location = generatePath("reset-password")}>
                        <PasswordResetRequest />
                    </Route>
                    <Route path="/reset-password">
                        <PasswordReset onPasswordReset={() => window.location = generatePath("/login")} />
                    </Route>
                    <Route exact path="/">
                        <Login onLogin={event => this.onUserLoaded(event.user)} />
                        <p>Forgot your password? <Link to="/request-password-reset">Reset it!</Link></p>
                    </Route>
                </div>
            </HashRouter>
        );
    }
}
