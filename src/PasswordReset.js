import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";


export default class resetPassword extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        step: 1,
        email: "",
        newPassword: "",
        secretCode: ""
      };
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    sendCode() {
    

        if (
            !this.state.email
        ) {
            return this.setState({ error: true });
        }

        axios
        .post("/api/reset/start", {
            email: this.state.email
        })
        .then((res) => {
            
            if (
                res.data.success = true) 
                {
                    this.setState({ step: 2 });
                }
        })
        .catch((err) => {
            
            this.setState({ error: true });
        });
    }

    resetPassword() {
        console.log("resetPassword function was called", this.state, this.state.email);

        if (
            !this.state.code ||
            !this.state.new_password
        ) {
            return this.setState({ error: true });
        }

        axios
        .post("/api/reset/password", {
            email: this.state.email,
            code: this.state.code,
            new_password: this.state.new_password
        })
        .then((res) => {
            
            if (
                res.data.success = true) 
                {
                    this.setState({ step: 3 });
                }
        })
        .catch((err) => {
            
            this.setState({ error: true });
        });
    }

    render() {
        if (this.state.step === 1) {
            return (
                <div>
                    <h2>Reset your password here</h2>
                    <br />
                    <input
                    placeholder="Email"
                    key="email"
                    onChange={e => this.handleChange(e)}
                    name="email"
                    id="email"
                    />
                    <br />
                    <button onClick={e => this.sendCode()}>Reset password</button>

                </div>
            );
        }

        if (this.state.step === 2) {
            return (
                <div>
                    <h2>Check your incoming emails</h2>
                    <br />
                    <input onChange={(event) => this.handleChange(event)} type="text" name="code" placeholder="Validation code" />
                        <input onChange={(event) => this.handleChange(event)} type="password" name="new_password" placeholder="New password" />
                        <button onClick={(event) => this.resetPassword()}>
                            Reset password
                        </button>
                </div>
            );

        }

        if (this.state.step === 3) {
            return (
                <div>
                    <p>Your password has succesfully been changed</p>
                    <Link to="/Login">Click here to login</Link>
                </div>
            )
        }
    };
}