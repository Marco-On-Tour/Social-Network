import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class PasswordReset extends React.Component {
<<<<<<< HEAD
=======
    /**
     */
>>>>>>> 9fea07cf8d40a89a57d0cb4746652079aa2c0c2b
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            secret: null,
            newPassword: null,
        };
    }

<<<<<<< HEAD
    async resetPassword() {
        const { email, secret, newPassword } = this.state;
        const result = await axios.post("/api/users/reset-password", {email, secret,newPassword});
        if (this.props.onPasswordReset){
            this.props.onPasswordReset();
        }
=======
    isFormComplete() {
        return Boolean(this.state.email && this.state.secret);
    }

    async resetPassword() {
        const result = await axios.post("/api/reset-password", this.state);
        this.props.onPasswordChanged(result.data);
>>>>>>> 9fea07cf8d40a89a57d0cb4746652079aa2c0c2b
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
                    type="password"
                    name="newPassword"
                    placeholder="new password"
                    onChange={(e) =>
                        this.setState({ newPassword: e.target.value })
                    }
                />
                <br />
<<<<<<< HEAD
                <input
                    name="secret"
                    placeholder="reset code"
                    onChange={(e) => this.setState({ secret: e.target.value })}
                />
                <br />
                <button onClick={(e) => this.resetPassword()}>Reset</button>
=======
                <button disabled={!this.isFormComplete()}>Submit</button>
>>>>>>> 9fea07cf8d40a89a57d0cb4746652079aa2c0c2b
            </div>
        );
    }
}
