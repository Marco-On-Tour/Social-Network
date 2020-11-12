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
    async submit(event) {
        if (
            !this.state.firstName ||
            !this.state.lastName ||
            !this.state.email ||
            !this.state.password
        ) {
            return this.setState({ error: true });
        } else {
            console.log("everything clean!");
            try {
                const response = await axios.post("/api/register", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                });
                location.replace("/");
            } catch (error) {
                console.log("error registering user", error);
                this.setState({ error: true });
            }
        }
    }
    render() {
        return (
            <div id="Register">
                <h2>Please register</h2>
                {this.state.error && (
                    <div className="error">Something went wrong.</div>
                )}
                <input
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <input
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
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
