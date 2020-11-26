import axios from './axios.js';
import {socket} from './sockets.js';

export async function loadFriends() {

    const res = await axios
        .get("/api/friends");
        console.log("friends list axios request", res);

    return {
        type: "load_friends",
        friends: res.data.friendList
    };
}


export async function acceptFriendRequest(id) {
    const res = await axios
    .post("/api/friend-status/accept-request/" + id);
    console.log("res of acceptfriendrequest button function", res);
    return {
        type: "accept_request",
        id
    }
    
}


export async function unfriendUser(id) {
    const res = await axios
    .post("/api/friend-status/unfriend/" + id);
    console.log("res of unfriendUser button function", res);
    return {
        type: "unfriend_user",
        id
    }
}


export async function cancelFriendRequest(id) {
    const res = await axios
    .post("/api/friend-status/cancel-request/" + id);
    console.log("res of cancelFriendRequest button functio", res);
    return {
        type: "cancel_request",
        id
    }
}

//messenger

export async function chatMessages(messages) {
    return {
        type: "received_messages",
        messages
    }
}


export async function newMessage(message) {

    socket.emit("newMessage", message);

    return {
        type: "new_message",
        message
    }
}