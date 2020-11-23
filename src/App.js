import React from 'react';
import Reset from './reset.js';
import { BrowserRouter, Link } from "react-router-dom";
import ProfilePic from "./ProfilePicture.js";
import Profile from ":/Profile.js";

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
      
        })
    }
   
    );

    <BrowserRouter


    />
        
}

    