import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Register from "./register";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
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
            const { data, status } = error.response;
            if (status != 404) {
                console.log(error.response);
            }
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <Route path="/login">
                        <Login />
                        <p>
                            Forgot your password?{" "}
                            <Link to="/password-reset-request">
                                Reset it here
                            </Link>
                        </p>
                    </Route>
                    <Route exact path="/register">
                        <Register />
                        <p>
                            Got an account? <Link to="/login">login</Link>
                        </p>
                    </Route>
                    <Route exact path="/password-reset">
                        <PasswordResetRequest />
                    </Route>
                    <Route exact path="/password-reset-request">
                        <PasswordReset />
                    </Route>
                </div>
            </Router>
        );
    }
}
