import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";

// Initialize Firebase
// inform your personal firebase info data
const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
}

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export const auth = firebase.auth()

export const database = firebase.database()
