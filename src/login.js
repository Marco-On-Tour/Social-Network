import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Login extends React.Component {
    constructor(){
        this.state = {
            email:null,
            password:null
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
            </div>
        );
    }


}