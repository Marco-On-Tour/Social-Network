import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class ProfilePicUploader extends React.Component {
    constructor(props){
        if (!props.userId){
            throw "userId prop is required for the ProfilePicUploader";
        }
        super(props);
        this.userId = props.userId;
    }

    upload(file) {
        this.set
    }

    render() {
        return (
            <div class="uploader">
                <input type="file" name="profilePicture" accept="image/*" onChange={(e) => this.setState({file: e.target.files[0]})} />
                <button onClick={(e) => this.upload()}>Upload!</button>
            </div>
        );
    }

}