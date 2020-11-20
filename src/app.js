import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Register from "./register";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Login from "./login";

export default class App extends React.Component {
    constructor() {
        console.log("app created");
        super();
        this.state = {
            user: null,
            modalOpen: false,
        };
    }
    async componentDidMount() {
        console.log("componentDidMount");
        await this.loadUser();
    }

    async loadUser() {
        console.log("loading user");
        try {
            const result = await axios.get("/api/users/me");
            console.log(result.data);
            this.setState({
                user: result.data,
            });
        } catch (error) {
            console.log(error);
        }
    }

    onUserLoaded(user) {
        this.setState({user:user});
    }

    render() {
        return (
            <Router>
                <div>
                    <Route path="/login">
                        <Login onUserLoaded={event => this.onUserLoaded(event.user)} />
                    </Route>
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
