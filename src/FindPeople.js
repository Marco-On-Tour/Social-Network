import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

export default function FindUsersFunction() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let ignore = false;
        async function findUsers() {
            const res = await axios.get("/api/find-user/" + query);
            if (!ignore) {
                setUsers(res.data.user);
            } else {
                console.log("No such user or other problem")
            }
        }
        if (query) {
            findUsers();
        }

        return () => {
            ignore = true;
        };
    }, [query]);

    return (
        <div id="find-users">
            <h1>Find other finance bros and gals: </h1>
            <input type="text" onChange={ event => setQuery(event.target.value) } />
            <hr />
            <div>
                {users && users.map((user) => {
                    console.log("user", user);
                    return (
                            <div key={user.id}>
                                <div>Firstname: {user.firstname}</div>
                                <div>Lastname: {user.lastname}</div>
                                <div>Bio: {user.bio}</div>
                                <div><Link to={`/user/${user.id}`}><img src={user.profile_pic}/></Link></div>
                            </div>
                    );
                })}
            </div> 

        </div> 
    );
} 