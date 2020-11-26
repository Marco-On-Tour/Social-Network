
import React, { useState, useEffect } from 'react';
import axios from './axios.js';

export default function FriendRequestFunction(props) {

        const [status, setStatus] = useState("");

        const {otherUsersId} = props;

        useEffect(() => { 
            async function getFriendStatus() {
                const res = await axios
                .get("/api/friend-status/" + otherUsersId);
                    console.log("res from axios get friend status request", res.data.status);
                    setStatus(res.data.status);
                }

            if(otherUsersId) {
            getFriendStatus();
            }

        }, [otherUsersId]);


    async function makeRequest() {
        const res = await axios
        .post("/api/friend-status/make-request/" + otherUsersId);
        setStatus(res.data.status);
        console.log("res.data.status makeRequest", res.data.status);
    }

    async function acceptFriendRequest() {
        const res = await axios
        .post("/api/friend-status/accept-request/" + otherUsersId);
        setStatus(res.data.status);
        console.log("res.data.status acceptFriendRequest", res.data.status);
    }

    async function cancelFriendRequest() {
        const res = await axios
        .post("/api/friend-status/cancel-request/" + otherUsersId);
        setStatus(res.data.status);
        console.log("res.data.status cancelFriendRequest", res.data.status);
    }

    async function unfriendUser() {
        const res = await axios
        .post("/api/friend-status/unfriend/" + otherUsersId);
        setStatus(res.data.status);
        console.log("res.data.status unfriendUser", res.data.status);
    }


    if(!status) {
        return (
            <button>Loading</button>
        )
    }

    if(status == "no_friend_request") {
        return (
            <button onClick={() => makeRequest()}>Add friend</button>
        )
    }

    if(status == "friend_request_accepted") {
        return (
            <button onClick={() => unfriendUser()}>Unfriend</button>
        )
    }

    if(status == "friend_request_made_by_me") {
        return (
            <button onClick={() => cancelFriendRequest()}>Cancel friend request</button>
        )
    }

    if(status == "friend_request_made_to_me") {
        return (
            <button onClick={() => acceptFriendRequest()}>Accept friend</button>
        )
    }
} 