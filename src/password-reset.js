import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class PasswordReset extends React.Component {
    constructor() {
        super();
        this.state = {
            email: null,
            secret: null,
            newPassword: null,
        };
    }

    render() {
        return (
            <div className="reset-form">
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                />
                <br />
                <input
                    name="secret"
                    placeholder="reset code"
                    onChange={(e) => this.setState({ secret: e.target.value })}
                />
                <br />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="new password"
                    onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                    }
                />
            </div>
        );
    }
}
