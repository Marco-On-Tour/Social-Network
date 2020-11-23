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