import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';
import ProfilePic from './ProfilePicture.js';
import BioEditor from './BioEditor.js';


export default class Profile extends React.Component {

    constructor() {
        super();
    }


    render() {

        if(!this.state.user) {
            return (<div>Not ready yet</div>);
        }

        const {firstname, lastname, profile_pic, bio} = this.props.user;   
        

        return (
            <div id="profile">
                <ProfilePicture
                ProfilePic= {profile_pic}

                Firstname= {firstname}
                Lastname= {lastname}
                bio= {bio}
            />
            </div>
        )

        }
    }