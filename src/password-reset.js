import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            secret: null,
            newPassword: null,
        };
    }

    async resetPassword() {
        const { email, secret, newPassword } = this.state;
        const result = await axios.post("/api/users/reset-password", {email, secret,newPassword});
        if (this.props.onPasswordReset){
            this.props.onPasswordReset();
        }
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
                    type="password"
                    name="newPassword"
                    placeholder="new password"
                    onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                    }
                />
                <br />
                <input
                    name="secret"
                    placeholder="reset code"
                    onChange={(e) => this.setState({ secret: e.target.value })}
                />
                <br />
                <button onClick={(e) => this.resetPassword()}>Reset</button>
            </div>
        );
    }
}
