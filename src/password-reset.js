import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class PasswordReset extends React.Component {
    /**
     */
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            secret: null,
            newPassword: null,
        };
    }

    isFormComplete() {
        return Boolean(this.state.email && this.state.secret);
    }

    async resetPassword() {
        const result = await axios.post("/api/reset-password", this.state);
        this.props.onPasswordChanged(result.data);
    }

    render() {
        return (
            <div className="reset-form">
                <h3>Reset your password</h3>
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
                <br />
                <button disabled={!this.isFormComplete()}>Submit</button>
            </div>
        );
    }
}
