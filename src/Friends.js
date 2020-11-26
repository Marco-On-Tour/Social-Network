import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import axios from "./axios.js";
import {loadFriends, acceptFriendRequest, unfriendUser, cancelFriendRequest} from "./actions.js";
import {useDispatch, useSelector} from "react-redux";
import { Link } from 'react-router-dom';


export default function Friends() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFriends())
    }, []); 

    const pendingRequests = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == false && friend.from_id == friend.id;
            });
        } else {
            return [];
        }
    });

    console.log("pendingRequests", pendingRequests)


    const acceptedFriends = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == true;
            })
        } else {
            return [];
        }
    })

    console.log("acceptedFriends", acceptedFriends)


    const requestsMadeByMe = useSelector(state => {
        if(state.friends) {
            return state.friends.filter(friend => {
                return friend.accepted == false && friend.from_id !== friend.id;
            });
        } else {
            return [];
        }
    });

    console.log("requestsMadeByMe", requestsMadeByMe)


    return (
        <div id="friends">

            <h1>Friends</h1>

            {pendingRequests.length > 0 && pendingRequests.map(pendingRequest => {
                return (
                    <Pending key={pendingRequest.id} {...pendingRequest}/>
                )
            })}

            <hr/>

            {acceptedFriends.length > 0 && acceptedFriends.map(acceptedFriend => {
                return (
                    <MyFriends key={acceptedFriend.id} {...acceptedFriend}/>
                )
            })}

            <hr/>

            {requestsMadeByMe.length > 0 && requestsMadeByMe.map(requestMadeByMe => {
                return (
                    <MyRequests key={requestMadeByMe.id} {...requestMadeByMe}/>
                )
            })}

        </div>
    );
     
}

function Pending(props) {

    const dispatch = useDispatch();

    return (
        <div>
            <div>Pending requests:</div>
            <div>Firstname: {props.firstname}</div>
            <div>Lastname: {props.lastname}</div>
            <div><Link to={`/user/${props.id}`}><img src={props.profile_pic} width="300px" height="270px" /></Link></div>
            <div><button onClick={event => dispatch(acceptFriendRequest(props.id))}>💖 Accept</button></div>
        </div>
    )
}

function MyFriends(props) {

    const dispatch = useDispatch();

    return (
        <div>
            <div>My friends:</div>
            <div>Firstname: {props.firstname}</div>
            <div>Lastname: {props.lastname}</div>
            <div><Link to={`/user/${props.id}`}><img src={props.profile_pic} width="300px" height="270px"/></Link></div>
            <div><button onClick={event => dispatch(unfriendUser(props.id))}>Unfriend</button></div>
        </div>
    )
}

function MyRequests(props) {

    const dispatch = useDispatch();

    return (
        <div>
                <div>Pending friend requests:</div>
                <div>Firstname: {props.firstname}</div>
                <div>Lastname: {props.lastname}</div>
                <div><Link to={`/user/${props.id}`}><img src={props.profile_pic} width="300px" height="270px" /></Link></div>
                <div><button onClick={event => dispatch(cancelFriendRequest(props.id))}>Cancel</button></div>
        </div>
    )
}