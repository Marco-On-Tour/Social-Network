import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";


export default class Reset extends React.Component {
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
        axios
        .post("/reset/start", {
            email: this.state.email
        })
        .then(({  data }) => {
            this.setState({ step: 2});
        });
    }

    resetPassword() {
        axios
        .post("/reset/update", {
            secretCode: this.state.secretCode,
            newPassword: this.state.newPassword
        })
        .then(({ data }) => {
            this.setState({ step: 3 });
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
                    <input type="text" name="code" />
                    <input type="password" name="new_password" />
                    <br />
                    <button onClick={(e) => this.resetPassword()}>
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