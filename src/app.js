import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter as Router, HashRouter, Link, Route, useHistory, generatePath, Redirect, Switch, BrowserRouter } from "react-router-dom";
import { async } from "crypto-random-string";


export default function App({profile}) {
    let [user, setUser] = useState(profile);
    const onLogin = (user) => {
        setUser(user);
    };
    
    return(
        <div className="app">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" component={() => <Login onLogin={(user) => onLogin(user)}/> }/>
                    <Route exact path="/register" component={() => <Register onRegister={(user) => onLogin(user)} />} />
                    <Route exact path="/request-password-reset" component={() => <PasswordResetRequest onResetRequested={history.pushState(null, null, "/")} />} />
                    <Route path="/profile" component={() => <Profile user={user} />} />
                    <Route path="/users/:id" render={props => (
                        <OtherProfile key={props.match.url} match={props.match} history={props.history} id={props.match.params.id}/>)} 
                    />
                </Switch>
            </BrowserRouter>
        </div>
    );
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
            console.log(result.data);
            setFirstName(result.data.firstName);
            setLastName(result.data.lastName);
            setBio(result.data.bio);
            setProfilePic(result.data.profilePic)
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
                    </div>                </div>
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
                </div>
            </main>
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