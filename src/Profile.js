import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';
import BioEditor from './BioEditor.js';
import ProfilePic from "./ProfilePicture.js";
import FindUsers from "./FindPeople.js";

export default class Profile extends React.Component {

    constructor() {
        super();
    }


    render() {

        if(!this.props.user) {
            return (<div>Wow, sexy</div>);
        }

        const {firstname, lastname, email, profile_pic, bio} = this.props.user;   
        const {openPopup, bioEditDone} = this.props;

        return (
            <div id="profile">

                        <div>Your Financial profile</div> 
                        <div>Firstname: {firstname}</div>
                        <div>Lastname: {lastname}</div>
                        <div>Email: {email}</div> 

                        <BioEditor 
                            userBio={bio}
                            bioEditDone={bioEditDone}
                        />

                        <ProfilePic
                            profilePicLarge={profile_pic} 
                            openPopup={openPopup}
                        />
                        
                </div>
            );
    }   
}