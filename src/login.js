import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email:null,
            password:null,
            reset:false
        }
    }
    
    async login() {
        console.log("loggin in");
        console.log([this.state.email, this.state.password]);
        if (this.state.email && this.state.password) {
            const result = await axios.post("/api/login", {
                email: this.state.email,
                password: this.state.password
            });
            this.props.onLogin({user: result.data});
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div id="login">
                <h3>Please Login</h3>
                <input name="email" placeholder="email address" type="email" onChange={(e) => this.handleChange(e)} />
                <br />
                <input name="password" placeholder="password" type="password" onChange={(e) => this.handleChange(e)} />
                <br />
                <button onClick={(e) => this.login()}>Login</button>
            </div>
        );
    }


}