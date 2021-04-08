import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase-config"
import { useContext, useState } from 'react';
import { userContext } from "../../App";
import { useHistory, useLocation } from "react-router";
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function Login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        error: '',
        success: ''

    })

    //Context API
    const [loggedInUser, setLoggedInUser] = useContext(userContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleSignIn = () => {
        firebase.auth().signInWithPopup(provider)
            .then((res) => {
                const { displayName, email, photoURL } = res.user;
                const loggedInUserData = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(loggedInUserData)
                setLoggedInUser(loggedInUserData)
                history.replace(from);
            });
    }
    const handleSignOut = () => {
        firebase.auth().signOut().then(res => {
            const clearUserData = {
                isSignedIn: false,
                name: '',
                email: '',
                photo: '',
                error: '',
                success: ''
            }
            setUser(clearUserData)
        }).catch(error => {
            console.log(error)
        });
    }
    const submitHandler = (e) => {

        if (newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((userCredential) => {
                    const newUsersInfo = { ...user }
                    newUsersInfo.error = '';
                    newUsersInfo.success = true;
                    setUser(newUsersInfo)
                    setLoggedInUser(newUsersInfo);
                    history.replace(from);
                    console.log(userCredential)
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    const newUsersInfo = { ...user }
                    newUsersInfo.error = errorMessage;
                    newUsersInfo.success = false;
                    setUser(newUsersInfo);

                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then(userCredential => {
                    const newUsersInfo = { ...user }
                    newUsersInfo.error = '';
                    newUsersInfo.success = true;
                    setUser(newUsersInfo)
                    setLoggedInUser(newUsersInfo);
                    history.replace(from);
                    console.log(userCredential)
                })
                .catch(error => {
                    console.log(error.code, error.message);
                });
        }
        e.preventDefault();
    }
    const inputHandler = (event) => {
        // console.log(event.target.name, event.target.value)
        let validUser = true;
        if (event.target.name === "email") {
            validUser = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(event.target.value);
        }
        if (event.target.name === "password") {
            validUser = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(event.target.value)
        }
        if (validUser) {
            const addNewUser = { ...user }
            addNewUser[event.target.name] = event.target.value;
            setUser(addNewUser)
        }
    }
    return (
        <div style={{ width: "80%", margin: "0 auto", textAlign: "center", background: "lightGray", padding: "30px" }}>
            {
                user.isSignedIn ? <button onClick={handleSignOut}>Log Out</button> :
                    <button onClick={handleSignIn}>Sign In</button>
            }
            <h3>Name: {user.name}</h3>
            <h3>Email: {user.email}</h3>
            <h3>Password : {user.password}</h3>
            {
                user.isSignedIn &&
                <div>
                    <h3>Name: {user.name}</h3>
                    <h3>Email: {user.email}</h3>

                    <img src={user.photo} alt="" style={{ width: "50%" }} />
                </div>
            }
            <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />
            <label htmlFor="newUser">New User Sign Up</label>
            <form onSubmit={submitHandler}>
                {
                    newUser && <input onBlur={inputHandler} type="text" name="name" placeholder="Name" required />
                }

                <br />
                <input onBlur={inputHandler} type="email" name="email" placeholder="Email" required />
                <br />
                <input onBlur={inputHandler} type="password" name="password" placeholder="Password" required />
                <br />
                <input type="submit" value="Submit" />
            </form>
            {
                user.success && <p style={{ color: 'green' }}>Successfully {newUser ? " sign up" : " Sign In"}</p>
            }
            <p style={{ color: 'red' }}>{user.error}</p>
        </div>
    );
}

export default Login;
