import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Register from "./register";

export default class App extends React.Component {
    constructor(){
        console.log("app created");
        super();
        this.state = {
            user: null,
            modalOpen: false,
        }
    }
    async componentDidMount() {
        console.log("componentDidMount");
        await this.loadUser();
    }

    async loadUser(){
        console.log("loading user");
        const userId = localStorage.getItem("userId");
        console.log(userId);
        if (userId){
            try{
                const result = await axios.get("/api/users/" + userId);
                console.log(result.data);
                this.setState({
                    user:result.data
                });
            } catch(error){
                console.error("could not load user data", error);
                this.state.error = "could not load user data";
            }
        }
    }

    render() {
        if (!this.state.user) {
            return <Register />
        } else {
            return <div>Welcome back old friend.</div>;
        }
    }
}