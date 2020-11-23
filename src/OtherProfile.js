import React from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import { Link } from 'react-router-dom';


export default class otherProfile extends React.Component {

    constructor() {
        super();
        this.state = {
            user: null,
            error: false,
        }
    }
}