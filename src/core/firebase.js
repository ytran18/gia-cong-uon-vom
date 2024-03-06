// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database"
import "firebase/compat/auth"
import "firebase/auth"
import "firebase/storage"
import "firebase/analytics"
import "firebase/performance"
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRuU7HqmaJU6PWkVot2eX0uyB6_KdU9d8",
    authDomain: "gia-cong-uon-vom.firebaseapp.com",
    projectId: "gia-cong-uon-vom",
    storageBucket: "gia-cong-uon-vom.appspot.com",
    messagingSenderId: "119792849505",
    appId: "1:119792849505:web:7f39a936b957679969d020"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const fireStore = getFirestore(app)

export {app, auth, db, storage, fireStore}