import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';

export default class Uploader extends React.Component {

    constructor() {
        super();
    }

    selectFile(event) {
        this.file = event.target.files[0];
        console.log("this.file", this.file);
    }

    uploadFile(event) {        
        const fd = new FormData();
        fd.append("file", this.file);

        axios
            .post("/api/fileupload", fd)
            .then((res) => {
                const newPic = res.data.updatedUser.profile_pic;
                console.log("axios post request new pic res", newPic);
                this.props.uploadDone(newPic);
            })

    }

    render() {
                return (
                    <div id="pic-uploader">

                        <div>Choose a profile picture</div>
                        <input type="file" name="fileupload" accept="image/*" onChange={(event) => this.selectFile(event)} /> <br/>
                        <button onClick={(event) => this.uploadFile(event)} >Upload</button>

                    </div>
                );
            }
    }