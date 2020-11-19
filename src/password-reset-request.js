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
