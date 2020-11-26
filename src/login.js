import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Login extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.onLogin = props.onLogin;
        this.onLogin.bind(this);
        this.state = {
            email:null,
            password:null,
            reset:false
        }
    }

    async login() {
        if (this.state.email && this.state.password) {
            const result = await axios.post("/api/users/login", {
                email: this.state.email,
                password: this.state.password,
            });
            this.onLogin(result.data);
        }
    }

    handleChange(event) {
        console.log("this.onLogin", this.onLogin)

        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div id="login">
                <h3>Please Login</h3>
                <input
                    name="email"
                    placeholder="email address"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={(e) => this.login()}>Login</button>
            </div>
        );
    }
}
