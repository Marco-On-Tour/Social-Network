const actions = {
    LOAD_FRIENDS: "LOAD_FRIENDS",
    ACCEPT_FRIEND: "ACCEPT_FRIEND",
    UNFRIEND: "UNFRIEND",
    ADD_BIO: "ADD_BIO"

}

exports.reducer = function(state={}, action){
    let { type, data } = action;
    if (type === actions.LOAD_FRIENDS) {
        const friends = data.friends;
        return { ...state, friends };
    } else if (type === actions.ACCEPT_FRIEND) {
        const id = data.friend.id;
        const friends = [];
        for (friend of friends) {
            if (friend.id === id) {
                friend.accepted = true;
                friends.push(friend);
            }
        }
        return {...state, friends}
    } else if (type === actions.UNFRIEND) {
        const id = data.id;
        const friends = state.friends.map((friend) => friend.id !== id);
        return { ...state, friends };
    }

    return state;
}

exports.actionTypes = actions;