import { actionTypes } from "./reducer"
import axios from "axios";

export function addBio(bio) {
    return {
        type: actionTypes.ADD_BIO,
        data: { bio }
    };
}
export async function loadFriends() {
    const url = "/api/users/me/friends";
    const response = await axios.get(url);
    const data = { friends: response.data };
    return {
        type: actionTypes.LOAD_FRIENDS, 
        data: { friends: response.data }
    };
}

export async function acceptFriendship(friendId) {
    const url = "/api/users/me/friends/" + friendId;
    const { data } = await axios.post(url);
    return {
        type: actionTypes.ACCEPT_FRIEND,
        data: { 
            friend: { data }
        }
    }
}