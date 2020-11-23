
import React from "react";
import { Link } from "react-router-dom";
import axios from "../axios.js";

export default class BioEditor extends React.Component {

    constructor() {
        super();
        this.state = {
            editBio: false,
            bioLoad: true,
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    BioUpdate(event) {

        axios
            .post("/api/updateBio", {
                bioEdit: this.state.bioeditor
            })
            .then((res) => {
                console.log("bio update", newBio);
                const newBio = res.data.updatedUser.bio;
                this.props.bioEditDone(newBio);
                this.setState({
                    editBio: false,
                    bioLoad: true,
                });
            }) 
    }

    render() {

        return (
                    <div id="bio-editor">

                        {this.state.bioLoad && (
                            <div id="show-bio">
                                <div>Bio: {this.props.userBio}</div> 
                                <button onClick={(event) => this.setState({ editBio: true, bioLoad: false })}>Edit bio</button>
                            </div>
                        )}

                        {this.state.editBio && (
                            <div id="edit-bio">
                                <textarea onChange={(event) => this.handleChange(event)} name="bioeditor" />
                                <button onClick={(event) => this.BioUpdate(event)}>Save</button>
                            </div>
                        )}

                    </div>
                );
        } 
    }
