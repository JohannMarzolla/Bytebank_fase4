import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
// @ts-ignore
import { Auth, getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyD5FkS9bGVwRo74g57df7ImUZi2fTPTjUM",
    authDomain: "bytebank-8af58.firebaseapp.com",
    projectId: "bytebank-8af58",
    storageBucket: "bytebank-8af58.firebasestorage.app",
    messagingSenderId: "491378965758",
    appId: "1:491378965758:web:7479b4e53821e6059cb9af"
  };

let app: FirebaseApp
let auth: Auth
let db : Firestore

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    db = getFirestore(app); 
} else {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app); 
}

export { app, auth, db }