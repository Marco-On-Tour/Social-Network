import React, {useState, useEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {newMessage} from './actions.js';

export default function Chat() {

   const [message, setMessage] = useState("");
   const dispatch = useDispatch();
   const messagesRef = useRef();

   const messages = useSelector((state) => state.messages);
   

   const sendMessage = () => {
       setMessage("");
       dispatch(newMessage(message));
   }

   useEffect(() => {
       if(messages && messages.length > 0) {
           messagesRef.current.scrollTop = messages.length * 30;
       }
   }, [messages]);


   return (
       <div id="chat">

           {!messages &&
           <div id="no-messages">
               No messages
           </div>
           }

           <div id="messages" ref={messagesRef}>
           {messages && messages.map(message => {
               return (
                   <div key={message.message_id}>
                       <div>{message.firstname}: {message.message_text}</div>
                   </div>
               )
           })}

               <div id="chat-form">
                   <input type="text" name="message" value={message} onChange={event => setMessage(event.target.value)}/>
                   <button onClick={sendMessage}>Send</button>
               </div>
           </div>

       </div>
   );
}
