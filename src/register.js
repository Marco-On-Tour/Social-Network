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
            console.log("something wrong", this.state)
            return this.setState({ error: true });
        } else {
            console.log("everything clean!");
            try {
                const response = await axios.post("/api/users/register-user", {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password,
                });
                console.log(response.data);
                this.state.user = response.data;
                window.localStorage.setItem("userId", this.state.user.id);
                window.location = "/";
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
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={(event) => this.handleChange(event)}
                />
                <br />
                <input
                    name="lastName"
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
                <br />
            </div>
        );
    }
}
