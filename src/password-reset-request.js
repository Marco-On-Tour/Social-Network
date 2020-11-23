<<<<<<< HEAD
import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
/**
 * @param {{onPasswordResetRequested?}} props 
 */
export default function PasswordResetRequest(props) {
    const [email, setEmail] = useState()
    async function requestReset() {
        console.log(email);
        await axios.post("/api/users/request-password-reset", {email: email});
        window.location = "/reset-password";
        if(this.props.onPasswordResetRequested) {
            this.props.onPasswordResetRequested();
        }
    }

    return (
        <div id="password-reset-request-form">
            <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={_ => requestReset()}> Reset!</button>
        </div>
    )
}
=======
import React from "react";
import axios from "axios";

export default class PasswordResetRequest extends React.Component {
    constructor() {
        super();
        this.state = {
            email: null,
        };
    }

    async reset() {
        const resp = await axios.post("/api/request-password-reset", {
            email: this.state.email,
        });
    }

    render() {
        <div className="password-reset-request">
            <h3>Reset your password</h3>
            <input
                type="email"
                name="email"
                placeholder="email"
                onChange={(e) => this.setState({ email })}
            />
            <button disabled={!this.state.email}>Reset!</button>
        </div>;
    }
}
>>>>>>> 9fea07cf8d40a89a57d0cb4746652079aa2c0c2b
