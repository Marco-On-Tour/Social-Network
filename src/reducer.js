export default function(state = {}, action) {


    if(action.type == "load_friends") {
        state = {
            ...state,
            friends: action.friends
        };
    } 

    //console.log("reducer action friends", action.friends)
    
    if(action.type == "accept_request") {
        state = {
            ...state,
            friends: state.friends.map((friend) => {
                if(friend.id == action.id) {
                    friend.accepted = true;
                }
                return friend;
            })
        };
    }

    
    if(action.type == "unfriend_user") {
        state = {
            ...state,
            friends: state.friends.filter((friend) => {
                return friend.id != action.id;
            })
        };
    }    


    if(action.type == "cancel_request") {
        state = {
            ...state,
            friends: state.friends.filter((friend) => {
                return friend.id != action.id;
            })
        };    
    
    }     
    
    console.log("reducer state friends", state.friends)

//messenger

if(action.type == "received_messages") {
    let existingMessages = state.messages || [];
    state = {
        ...state,
        messages: [...existingMessages, ...action.messages]
    };
}


    return state;
      
 } 