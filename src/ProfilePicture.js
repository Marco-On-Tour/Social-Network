import React from "react";
import axios from "../axios.js";
import { Link } from "react-router-dom";

export default class ProfilePicture extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    render() {
        if (this.props.img_url) {
            return (
                <div id="ProfilePicture" onClick={this.props.clickHandler}>
                    <img src={this.props.img_url}></img>
                </div>
            );
        } else {
            return (
                <div
                    id="ProfilePicture"
                
                    onClick={this.props.clickHandler}
                >
                    <img src="/public/kelly-sikkema-XHXOafBIOhc-unsplash.jpg"></img>
                </div>
            );
        }
    }
}