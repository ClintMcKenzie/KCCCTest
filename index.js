import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import {getDatabase, ref, set, onValue} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { getAuth, getRedirectResult, signInWithRedirect, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

//getDatabase allows access to the DB, ref determines where you want to look in the DB (and can make a path), set sets the value,
//onValue returns the value and re-returns every time it, or its children, are changed?
//There's also push(), used for adding to a list without the possible overriding of 'set', could be useful?
//Pretty much all this info is from https://www.youtube.com/watch?v=pP7quzFmWBY&ab_channel=Firebase

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBfnd1C_OQbB7ehJcKEs6w3YzbmNIEkxUk",
    authDomain: "kcccapptest.firebaseapp.com",
    databaseURL: "https://kcccapptest-default-rtdb.firebaseio.com",
    projectId: "kcccapptest",
    storageBucket: "kcccapptest.appspot.com",
    messagingSenderId: "642728447440",
    appId: "1:642728447440:web:4b9c17e8c7747d845ebdd5",
    measurementId: "G-8SD4KX1WLZ"
});

const db = getDatabase();

//Delete?
function writeUserData(userId, name, email, imageUrl) {
    const reference = ref(db, "users/" + userId);

    set(reference, {
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}

const provider = new GoogleAuthProvider(); //auth stuff
const auth = getAuth();

function redirect() {
    signInWithRedirect(auth, provider);
}

var isAdmin = false;
getRedirectResult(auth) //auth stuff
    .then((result) => {
        // The signed-in user info.
        isAdmin = (result.user.email == "3074517@smsd.org");
        if (result.user.email != null && result.user.email != "") {
            document.getElementById("signIn").remove();
        }
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });

//delete
function readUserName(userId) {
    const reference = ref(db, "users/" + userId + "/username");
    var data;
    onValue(reference, (snapshot) => {
        data = snapshot.val();
    });
    return data;
}

//delete
function getUserInfo(userId) {
    const reference = ref(db, "users/" + userId);
    var str1 = "";

    onValue(reference, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childValue = childSnapshot.val();
            str1 += childKey + ": " + childValue + "; ";
        })
    });
    return str1;
}

//Rewrite for teams
/* Test suite
writeUserData("Clint","CMcKenzie","clint@gmail","hi");

writeUserData("Peyton","PPeck","peyton@gmail","hello");

writeUserData("Adam","ABerry","adam@gmail","yo");

writeUserData("Adrian","AJanner","adrian@gmail","hey");
*/

//Delete
const userReference = ref(db, "users"); //Puts all user info on website
onValue(userReference, (snapshot) => {
    const element = document.getElementById("div1");
    element.innerHTML = "";
    snapshot.forEach((user) => {
        var dataString = "";
        user.forEach((userData) => {
            dataString += userData.key+": "+userData.val() + "; ";
        })
        const dataSpan = document.createElement("span");
        const text = document.createTextNode(dataString);
        dataSpan.appendChild(text);
        dataSpan.setAttribute("class","userData");
        const deleteButton = document.createElement("button");
        if (isAdmin) {
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", function() {
                removeUser(user);
            });
        }
        const lineBreak = document.createElement("br");
        element.appendChild(dataSpan);
        if (isAdmin) {
            element.appendChild(deleteButton);
        }
        element.appendChild(lineBreak);
    })
});

const teamReference = ref(db, "teams"); //Puts all team info on website
onValue(teamReference, (snapshot) => {
    const element = document.getElementById("div2");
    element.innerHTML = "";
    snapshot.forEach((team) => {
        const teamNamePara = document.createElement("p");
        teamNamePara.appendChild(document.createTextNode(team.key));
        teamNamePara.style.fontWeight = "bold";
        element.appendChild(teamNamePara);
        team.forEach((event) => {
            const eventSpan = document.createElement("span");
            eventSpan.appendChild(document.createTextNode(event.key));
            element.appendChild(eventSpan);
            element.appendChild(document.createElement("br"));
            element.appendChild(document.createElement("br"));
            var dataString = "";
            event.forEach((eventData) => {
                dataString += eventData.key + ": "+ eventData.val() + " | ";
            })
            dataString = dataString.substring(0, dataString.length-3);
            const dataSpan = document.createElement("span");
            const dataText = document.createTextNode(dataString);
            dataSpan.appendChild(dataText);
            element.appendChild(dataSpan);
        })
        const deleteButton = document.createElement("button");
        if (isAdmin) {
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", function() {
                removeTeam(team);
            });
        }
        if (isAdmin) {
            element.appendChild(deleteButton);
        }
        element.appendChild(document.createElement("br"));
        element.appendChild(document.createElement("br"));
    })
});

//Add user on submit
//Delete?
function addUser() {
    var myForm = document.getElementById('myForm');
    var formData = new FormData(myForm);
    if (formData.get("userID") == "") {
        return; //Later, display a message?
    }
    writeUserData(formData.get("userID"), formData.get("name"), formData.get("email"), formData.get("picURL"));
    myForm.reset();
}

//Add team (and info) on submit
function addTeamInfo() {
    var teamForm = document.getElementById("teamForm");
    var formData = new FormData(teamForm);
    if (formData.get("userID") == "") {
        return; //Later, display a message?
    }
    //writeUserData(formData.get("userID"), formData.get("name"), formData.get("email"), formData.get("picURL")); change this!
    teamForm.reset();
}

//Delete?
function removeUser(user) {
    const reference = ref(db, "users/" + user.key);
    set(reference, null);
}

function removeTeam(team) {
    const reference = ref(db, "teams/" + team.key);
    set(reference, null);
}

document.getElementById("submit").addEventListener("click",addUser);//Delete?

document.getElementById("teamSubmit").addEventListener("click",addTeamInfo);

document.getElementById("signIn").addEventListener("click",redirect);

//Remove..?
const inputs = document.getElementsByTagName("input");
for (var i = 0; i < inputs.length; i++) {
    inputs.item(i).setAttribute("autocomplete","off");
}

//The part that will add info to teams!
//You first input team name, then number of fields, then enter key:value pairs!
//Input for name, input for # fields, then side-by-side key and value inputs
