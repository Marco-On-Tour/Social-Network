import React from 'react';
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { BrowserRouter, Route, Link } from "react-router-dom";
import ProfilePic from "./ProfilePicture.js";
import Profile from "./Profile.js";
import OtherProfile from "./OtherProfile.js";
import Uploader from "./Uploader.js";
import FindUsers from "./FindPeople.js";
import Friends from "./Friends.js";
import Chat from './Chat.js';

export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            user: null,
            uploadPopup: false,
        } 
    }
    componentDidMount() {
        axios
        .get("/api/user")
        .then((res) => {
           
            this.setState({ user: res.data });
        })
        .catch((err) => {
            console.log("Error getting user data", err);
        })
    }

    render() {

        if(!this.state.user) {
            return (<div>Loading...</div>);
        } else { 

            return (

                <div id="app">

                    <ProfilePic 
                        profilePicSmall={this.state.user.profile_pic}
                        openPopup={(event) => this.setState({ uploadPopup: true })}
                    />

                    {this.state.uploadPopup && (
                        <Uploader 
                            uploadDone={newPic => {this.setState({ 
                                user: {
                                    ...this.state.user,
                                    profile_pic: newPic,
                                },
                                uploadPopup: false,
                            });}} 
                        />
                    )}

                    <BrowserRouter>

                    <div id="nav">
                            <hr />
                            <strong>Menu</strong>
                            <div><Link to="/">Your Profile</Link></div>
                            <div><Link to="/friends">Friends list</Link></div>
                            <div><Link to="/find-user">Find finance peeps</Link></div>
                            <div><Link to="/chat">Messenger</Link></div>
                            <hr />
                            </div>


                        <div>

                            <Route
                                exact path="/" render={() => (
                                <div>
                                    <Profile 
                                        user={this.state.user} 
                                        openPopup={(event) => this.setState({ uploadPopup: true })} 
                                        bioEditDone={newBio => {this.setState({
                                            user: {
                                                ...this.state.user,
                                                bio: newBio,
                                            }
                                        });}}
                                    />
                                </div>)}
                            />

                            <Route
                                path="/user/:id" render={(props) => (

                                    <div>
                                        <OtherProfile key={props.match.params.id} match={props.match} history={props.history}
                                        />
                                    </div>
                                )}
                            />
                            <Route path="/find-user" component={FindUsers}/>
                            <Route path="/friends" component={Friends}/>
                            <Route path="/chat" component={Chat}/>
                                    

                    

                        </div>

                    </BrowserRouter>



                </div>
            );
        }
    }
}


