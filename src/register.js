import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
export default class Register extends React.Component {
    constructor() {
        super();
        this.state = { error: false };
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    submit(event) {
        if (
            !this.state.firstName ||
            !this.state.lastName ||
            !this.state.email ||
            !this.state.password
        ) {
            return this.setState({ error: true });
        } else {
            console.log("everything clean!");
            return axios
                .post("/api/register", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                })
                .then((response) => {
                    location.replace("/");
                })
                .catch((error) => {
                    console.log("error registering user", error);
                    this.setState({ error: true });
                });
        }
    }
    render() {
        return (
            <div id="Register">
                <h2>Please register</h2>

                {this.state.error && (
                    <div className="error">Something went wrong.</div>
                )}
                <label for="firstname">First Name</label>
                <input
                    name="firstname"
                    type="text"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <label for="lastName">Last Name</label>
                <input
                    name="lastname"
                    type="text"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <label for="email">Email</label>
                <input
                    name="email"
                    type="email"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <label for="password">Password</label>
                <input
                    name="password"
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
            </div>
        );
    }
}