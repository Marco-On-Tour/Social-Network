import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Register from "./register";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Login from "./login";

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
        try{
            const result = await axios.get("/api/users/me");
            console.log(result.data);
            this.setState({
                user:result.data
            });
        } catch(error) {
            console.log(error);
        }
        // if (userId){
        //     try{
        //         const result = await axios.get("/api/users/" + userId);
        //         console.log(result.data);
        //         this.setState({
        //             user:result.data
        //         });
        //     } catch(error){
        //         console.error("could not load user data", error);
        //         this.state.error = "could not load user data";
        //     }
        // }
    }

    render() {
        return (
            <Router>
                <div>
                    <Route path="/login" component={Login} />
                    <Route exact path="/">
                        <Register />
                        <p>
                            Got an account? <Link to="/login">login</Link>
                        </p>
                    </Route>
                </div>
            </Router>        
        );
    }
}