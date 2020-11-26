import * as io from 'socket.io-client';
import {chatMessages} from './actions.js';

export let socket;

export const init = (store) => {
    if(!socket) {
        socket = io.connect();
    }

    socket.on("chatMessages", (messages) => {
        console.log("all chat messages from sockets.js", messages);
        store.dispatch(chatMessages(messages));
    });

    socket.on("chatMessage", (message) => {
        console.log("single chat message from sockets.js", message);
        store.dispatch(chatMessages([message]));
    });
 
};