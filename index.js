import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import {getDatabase, ref, set, onValue} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
//import { GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

//Logging in first
//const provider = new GoogleAuthProvider();


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

function writeUserData(userId, name, email, imageUrl) {
    const reference = ref(db, "users/" + userId);

    set(reference, {
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}

function readUserName(userId) {
    const reference = ref(db, "users/" + userId + "/username");
    var data;
    onValue(reference, (snapshot) => {
        data = snapshot.val();
    });
    return data;
}

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

//writeUserData("Clint","CMcKenzie","clint@gmail","hi");

//writeUserData("Peyton","PPeck","peyton@gmail","hello");

//writeUserData("Adam","ABerry","adam@gmail","yo");

//writeUserData("Adrian","AJanner","adrian@gmail","hey");

//Test, should loop through each user and output all info on the webpage
const reference = ref(db, "users");
onValue(reference, (snapshot) => {
    const element = document.getElementById("div1");
    element.innerHTML = "";
    snapshot.forEach((user) => {
        var dataString = "";
        user.forEach((userData) => {
            dataString += userData.key+": "+userData.val() + "; ";
        })
        const newElement = document.createElement("span");
        const text = document.createTextNode(dataString);
        newElement.appendChild(text);
        const newElement2 = document.createElement("button");
        newElement2.innerText = "Delete";
        newElement2.addEventListener("click", function() {
            removeUser(user);
        });
        const newElement3 = document.createElement("br");
        element.appendChild(newElement);
        element.appendChild(newElement2);
        element.appendChild(newElement3);
    })
});

//Add stuff on submit
function addUser() {
    var myForm = document.getElementById('myForm');
    var formData = new FormData(myForm);
    if (formData.get("userID") == "")
        return; //Later, display a message?
    writeUserData(formData.get("userID"), formData.get("name"), formData.get("email"), formData.get("picURL"));
    myForm.reset();
}

function removeUser(user) {
    const reference = ref(db, "users/" + user.key);
    set(reference, null);
}

document.getElementById("submit").addEventListener("click",addUser);
