import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
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
        if (!this.state.email || !this.state.password) {
            return this.setState({ error: true });
        }

        axios
            .post("/api/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then((res) => {
                console.log("response axios post request login", res);

                if (
                    res.data.success = true) 
                    {
                        location.replace("/");
                    }

            })
            .catch((err) => {
                console.log("Error logging in user", err);
                this.setState({ error: true });
            });
    }

    render() {
        return (
            <div id="login">
                
                {this.state.error && (<div className="error">Please fill out all fields.</div>)}

                <div>
                    <input onChange={(event) => this.handleChange(event)} name="email" type="email" placeholder="Email"></input>
                </div>
                <div>
                    <input onChange={(event) => this.handleChange(event)} name="password" type="password" placeholder="Password"></input>
                </div>
                <button onClick={(event) => this.submit(event)}>Login</button> 
                <div>
                    Not registered yet? <Link to="/">Register here.</Link>
                </div>
                <div>
                    Forgot your password? <Link to="/reset/password">Reset password here.</Link>
                </div>
                <div>
                     <Link to="/app">Edit profile.</Link>
                </div>
            </div>
        );
    }

}