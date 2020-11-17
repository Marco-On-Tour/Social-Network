import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    submit(event) {
        // Validation
        // If one of the fields is empty: Show error message.
        if (
            !this.state.email ||
            !this.state.password
        ) {
            return this.setState({ error: true });
        }

        axios
        .post("/api/login", {
            email: this.state.email,
            password: this.state.password,
        })
        .then((response) => {
            console.log("IT WORKED!");
            console.log("response came in", response);

            location.replace("/");
        })
        .catch((error) => {
            console.log("Error registering user", error);
            this.setState({ error: true });
        })
    }

    render() {
        return (
            <div id="Login">
            <h2>Please login</h2>

            {this.state.error && (
                    <div className="error">Something went wrong.</div>
                )}

                <label htmlFor="email">Email</label>
                <input
                    name="email"
                    id="email"
                    type="email"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <label htmlFor="password">Password</label>
                <input
                    name="password"
                    id="password"
                    type="password"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />

                <button
                    id="login-button"
                    onClick={(event) => this.submit(event)}
                >
                    Login
                </button>

                <p>Would you like to register?{""}
                <Link to="/"> Register</Link>.
                </p>
                <p>Forgot password? <Link to="/reset">Reset password</Link>.
                </p>
            </div>
        );
    }

}