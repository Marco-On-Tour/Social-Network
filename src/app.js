import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter as Router, HashRouter, Link, Route, useHistory, generatePath, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { actionTypes, reducer} from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { async } from "crypto-random-string";
import { loadFriends } from "./actions";

export default function App({profile}) {
    let [user, setUser] = useState(profile);
    const onLogin = (user) => {
        setUser(user);
    };
    return(
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={() => 
                        <Login onLogin={(user) => onLogin(user)}/> }
                    />
                    <Route exact path="/register" component={() => 
                        <Register onRegister={(user) => onLogin(user)} />} 
                    />
                    <Route exact path="/request-password-reset" component={() => 
                        <PasswordResetRequest onResetRequested={history.pushState(null, null, "/")} />} 
                    />
                    <Route path="/profile" component={() => 
                        <Profile user={user} />} 
                    />
                    <Route path="/users/:id" render={props => (
                        <OtherProfile key={props.match.url} match={props.match} history={props.history} id={props.match.params.id}/>)} 
                    />
                    <Route exact path="/users" component={()=><Users />} />
                    <Route exact path="/friends" component={() => <Friends />} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}

function Friends() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadFriends());
    }, []);

    const incomingRequests = useSelector((state) => {
        if (state.friends) {
            return state.friends.filter((f) => !f.accepted);
        }
    });

    const mutuals = useSelector((state) => {
        if (state.friends){
            return state.friends.filter((f) => f.accepted);
        }
    })

    function incomingFriends() {
        if (incomingRequests && incomingRequests.length > 0) {
            return (
                <div className="incoming-friends">
                    <h3>These people want to be your friends</h3>
                    {incomingRequests.map((f) =>(
                        <div key={f.id}>
                            lol
                        </div>   
                    ))}
                </div>  
            );
        }
    }

    function mutualFriends() {
        if (mutuals && mutuals.length > 0) {
            return (
                <div className="mutual-friends">
                    <h3>These people are your friends</h3>
                    { mutuals.map((f) =>(
                        <div key={f.id}>
                            <img src={f.profilePic} />
                        </div>   
                    ))}
                </div>  
            );
        }
    }
    
    return (
        <div id="friends">
            { incomingFriends() }
            { mutualFriends() }
        </div>
    );
}

function IncomingFriendRequest() {

}
    
function Users({users=[]}) {
    const [userList, setUserList] = useState(users)
    const [query, setQuery] = useState()
    // passing the empty array [] to useEffect as a second parameter
    // prevents it from being called more than once at initialization.
    // It seems complicated, it's explained at ^1, but for now I don't 
    // get the why, just the how
    // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
    useEffect(()=> {
        (async function() {
            let url = "/api/users";
            if (query && query.length >= 2){
                url += "?query=" + query;
            }
            const result = await axios.get(url);
            setUserList(result.data);
        })();
    },[query]); 

    const onQueryChange = async (e) => {
        const queryInput = e.target.value;
        setQuery(queryInput);
    }
    
    return(
        <div>
            <h3>See who's here!</h3>
            <div className="user-filter">
                <input type="text" name="query" onChange={onQueryChange} placeholder="search by name"/>
            </div>
            <ol className="user-list">
                {userList.map(user => (
                    <li key={user.id}>
                        <Link style={{ display:"block" }} to={"/users/" + user.id}>
                            <img src={user.profilePic} 
                                alt={`profile pic for ${user.firstName} ${user.lastName}`} />
                        </Link>
                        <div>
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p>{user.bio && user.bio.slice(0, 100)} ...</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}

function FriendButton({userId, onFriendshipAdded}) {

    const [status, setStatus] = useState("NO_FRIENDSHIP");
    useEffect(() => {
        (async function(){
            const url = "/api/users/friends-status/:friendId".replace(":friendId", userId);
            console.log(url);
            const response = await axios.get(url);
            const status = response.data;
            setStatus(status);
        })();
    },[])

    const request = async () => {
        const url = "/api/users/me/friends/:friendId".replace(":friendId", userId);
        const response = await axios.post(url);
        setStatus("FRIENDSHIP_REQUESTED_BY_ME");
    }

    const unfriend = async() => {
        const url = "/api/users/me/friends/:friendId".replace(":friendId", userId);
        const response = await axios.post(url);
        setStatus("FRIENDHIP_REQUESTED_BY_THEM");
    };

    switch (status) {
        case "MUTUAL_FRIENDSHIP": 
            return <button onClick={() => unfriend()}>Unfriend</button>
        case "FRIENDSHIP_REQUESTED_BY_ME":
            return <button onClick={() => unfriend()}>Withdraw Request</button>
        case "FRIENDHIP_REQUESTED_BY_THEM":
            return <button onClick={() => accept()}>Accept Request</button>
        case "NO_FRIENDSHIP":
            return <button onClick={() => request()}>Request Friendship</button>

    }

}

function OtherProfile(props) {
    const userId = props.id;
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [profilePic, setProfilePic] = useState(props.setProfilePic);
    const [bio, setBio] = useState(props.bio);

    useEffect(()=>{
        (async function(){
            const url = "/api/users/" + userId;
            const result = await axios.get(url);
            setFirstName(result.data.firstName);
            setLastName(result.data.lastName);
            setBio(result.data.bio);
            setProfilePic(result.data.profilePic);
        })();
    },[]);

    return (
        <div>
            <header className="loggedIn">
                <div id="logo-small">
                    <img src="https://via.placeholder.com/100x100?text=logo" alt="small logo" />
                </div>
                <div id="profilePic-small">
                    <div className="profile-pic-container">
                        <img className="profilePic" src={profilePic || "https://via.placeholder.com/200x200?text=profile"} /> 
                    </div>   
                </div>
            </header>
            <main className="profile">
                <div id="column-left" className="column">
                    <h4>My Picture</h4>
                    <div className="profile-pic-container">
                        <img className="profilePic" src={profilePic || "https://via.placeholder.com/200x200?text=profile"} /> 
                    </div>
                    <FriendButton userId={userId} />
                </div>
                <div id="column-right" className="column">
                    <h3>{firstName} {lastName}</h3>
                    <p>
                        {bio}
                    </p>
                </div>
            </main>
        </div>
    );
}

function Profile({user, onProfileUpdated}){
    let [profile, setProfile] = useState(user);

    const onUpdated = (bio) => {
        profile.bio = bio;
        setProfile(profile);
    }

    return (
        <div>
            <header className="loggedIn">
                <div id="logo-small">
                    <img src="https://via.placeholder.com/100x100?text=logo" alt="small logo" />
                </div>
                <div id="profilePic-small">
                    <ProfilePic width="100" src={profile.profilePic} onClick={(e) => switchModal()}  />
                </div>
            </header>
            <main className="profile">
                <div id="column-left" className="column">
                    <h4>My Picture</h4>
                    <ProfilePic src={profile.profilePic} onClick={(e) => switchModal()}  />
                </div>
                <div id="column-right" className="column">
                    <h3>{profile.firstName} {profile.lastName}</h3>
                    <Bio rows={16} cols={72} biography={profile.bio} withEditor={true} onUpdated={onUpdated}/>
                    <div>
                        <Link to="/users">Add your friends!</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ProfilePic({src, width, height, onClick}) {
    let [url, setUrl] = useState(src);
    let [isModalOpen, setIsModalOpen] = useState(false);

    const switchModal = () => {
        if (isModalOpen) {
            setIsModalOpen(false);
        } else {
            setIsModalOpen(true);
        }
    };

    const modalStyle = () => {
        if (isModalOpen){
            return {display: "block"}
        }
    }
    return (
        <div>
            <div className="modal">
                <PictureUploader />
            </div>
            <div className="profile-pic-container">
                <img className="profilePic" style={{cursor:"pointer"}} src={url || "https://via.placeholder.com/200x200?text=profile"} onClick={switchModal}/> 
            </div>
            <div id="profile-modal" className="modal" style={modalStyle()}>
                <div className="modal-content">
                    <div className="modal-header">
                        <button className="close-button" onClick={() => setIsModalOpen(false)} >
                            close
                        </button>
                    </div>
                    <div className="modal-footer">
                        <PictureUploader onPicUploaded={setUrl}/>
                    </div>
                </div>
            </div>
        </div>
    );

}


function Bio({biography, withEditor, rows, cols, onUpdated}) {
    const [bio, setBio] = useState(biography);
    const [switchEditorOn, setSwitchEditorOn] = useState(withEditor && !biography);
    

    const updateBio = async () => {
        const url = "/api/users/me/bio";
        const result = await axios.post("/api/users/me/bio", {
            bio
        });
        setSwitchEditorOn(false);
        onUpdated(bio);
    }

    return (
        <div className="bio"> 
            <div className="editor" style={{display: switchEditorOn ? "block": "none"}}>
                <textarea rows={rows} cols={cols} onChange={e => setBio(e.target.value)} value={bio} />
                <br />
                <button style={{display:"inline"}} onClick={updateBio}>Save</button>
                <button style={{display:"inline"}} onClick={() => setSwitchEditorOn(false)}>Cancel</button>

            </div>
            <div className="text" style={{display: switchEditorOn ? "none" : "block"}}>
                <div>
                    {bio}
                </div>
                <p>
                    <a href="#" onClick={() => setSwitchEditorOn(true)}>edit</a>
                </p>
            </div>
        </div>

    )
}

function PictureUploader({onPicUploaded}) {
    const url = "/api/upload/";
    const [file, setFile] = useState();

    const onFileSelected = (event) => {
        setFile(event.target.files[0]);
    };

    const canUpload = () => {
        return Boolean(file);
    }

    const upload = async () => {
        if (!file) {
            throw "file not selected";
        }
        const form = new FormData();
        form.append("file", file);
        const result = await axios.post(url, form, {
            headers: { 'Content-Type': "multipart/form-data" }
        });
        onPicUploaded(result.data.profilePic);
    };

    return (
        <div>
            <h4>Upload a new profile Picture</h4>
            <input type="file" accept="image/*" onChange={onFileSelected} />
            <button disabled={!canUpload()} onClick={upload}>Upload!</button>
        </div>);
} 


function Login({onLogin}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    
    const login = async() => {
        try {
            const result = await axios.post("/api/users/login", {email, password});
            onLogin(result.data);
        } catch(error) {
            console.console.error(error);
        }
    }
    return (
        <div id="login">
            <h3>Please Login</h3>
            <input
                name="email"
                placeholder="email address"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                name="password"
                placeholder="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={(e) => login()}>Login</button>
        </div>
    );
}

function Register({onRegister}) {
    let [email, setEmail] = useState();
    let [firstName, setFirstName] = useState();
    let [lastName, setLastName] = useState();
    let [password, setPassword] = useState();
    let [error, setError] = useState();

    const canSubmit = () => {
        if (email && firstName && lastName && password) {
            return true;
        } else {
            return false;
        }
    }

    const submit = async () => {
        try {
            const response = await axios.post("/api/users/register-user", {
                firstName, lastName, email, password
            });
            onRegister(response.data);
        } catch(error) {
            setError(error.data);
        }
    }

    return (
        <div id="Register">
                <h2>Please register</h2>
                {error && (
                    <div className="error">Something went wrong.</div>
                )}
                <input name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)} />
                <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)} />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} />
                <button 
                    disabled={!canSubmit}
                    id="register-button"
                    onClick={(_) => submit()}
                >
                    Register
                </button>
            </div>
    );
}

function PasswordResetRequest({onResetRequested}) {
    const [email, setEmail] = useState()
    async function requestReset() {
        await axios.post("/api/users/request-password-reset", {email: email});
        onResetRequested();
    }
    const canSend = () => {
        return Boolean(email);
    };
    return (
        <div id="password-reset-request-form">
            <h3>Reset your password</h3>
            <p>
                You know the drill. You'll get a mail with a secret code. 
            </p>
            <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <button disabled={!canSend()} onClick={_ => requestReset()}> Reset!</button>
        </div>
    )
}