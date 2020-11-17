import React from "react";
import ReactDOM from "react-dom";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Register extends React.Component {
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
            !this.state.firstname ||
            !this.state.lastname ||
            !this.state.email ||
            !this.state.password
        ) {
            return this.setState({ error: true });
        }

        console.log("Submit the form data", this.state);
        axios
            .post("/api/register", {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
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
            });
    }

    render() {
        return (
            <div id="Register">
                <h2>Please register</h2>

                {this.state.error && (
                    <div className="error">Something went wrong.</div>
                )}

                <label htmlFor="firstname">First name</label>
                <input
                    name="firstname"
                    id="firstname"
                    type="text"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <label htmlFor="lastname">Last name</label>
                <input
                    name="lastname"
                    id="lastname"
                    type="text"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
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
                    id="register-button"
                    onClick={(event) => this.submit(event)}
                >
                    Register
                </button>

                <p>
                    Already have an account? Go to our{" "}
                    <Link to="/login">Login page</Link>.
                </p>
            </div>
        );
    }
}