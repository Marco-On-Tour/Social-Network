import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class ProfilePic extends React.Component {
    constructor() {
        super();
        
    }

    render() {
        const {profilePicSmall, profilePicLarge, openPopup} = this.props;
        //console.log("profile pic props in profile pic component", this.props);

        if(profilePicSmall) { 
            return (
                <div id="profile-pic">
                    <div></div>
                    <img src={profilePicSmall} width="150px" height="120px" onClick={openPopup} />
                </div>
            );
        } if(profilePicLarge) { 
            return (
                <div id="profile-pic">
                    <div></div>
                    <img src={profilePicLarge} width="300px" height="270px" onClick={openPopup} />
                </div>
            );
        } else { 
            return (
                <div id="profile-pic">
                    <img src="/user-pics/kelly-sikkema-XHXOafBIOhc-unsplash.jpg" width="350px" height="250px" onClick={openPopup} />
                </div>
            );
        }   
    }
}






//"/public/kelly-sikkema-XHXOafBIOhc-unsplash.jpg"