import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';
import FriendRequest from './FriendRequest.js';


export default class otherProfile extends React.Component {

    constructor() {
        super();
        this.state = {
            user: null,
            error: false,
        }
    }


    componentDidMount() {

        const userId = this.props.match.params.id;
        console.log("other users id", userId);

        axios
            .get("/api/user/" + userId)
            .then((res) => {
                console.log("response from axios get request other user", res);
                console.log("res.data.success", res.data.success);
                console.log("res.data.itsMe", res.data.itsMe);
                console.log("res.data.user", res.data.user);
            if(res.data.success) {
                if(res.data.itsMe) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        user: res.data.user,
                    })
                }

            } else {
                    this.setState({
                        error: true
                    })
                }
            })
    }
    render() {

        if(!this.state.user) {
            return (<div>Not ready yet</div>);
        }

        console.log("current this.state.user", this.state.user);
        const {id, firstname, lastname, email, profile_pic, bio} = this.state.user;

        return (
            <div id="otherprofile">

                {this.state.error && (<div className="error">User does not exist.</div>)}

                <div>Firstname: {firstname}</div>
                <div>Lastname: {lastname}</div>
                <div>Email: {email}</div>
                <div>Bio: {bio}</div>
                <img src={profile_pic} width="350px" height="335px"/>
                <FriendRequest otherUsersId={id}/>

            </div>
        );
    }   
}