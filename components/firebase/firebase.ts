// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { /* connectFirestoreEmulator, */ getFirestore } from 'firebase/firestore';
import { /* connectStorageEmulator, */ getStorage } from 'firebase/storage';
// import { isDev } from '../isDev';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFSFfMcYRikqkouV_msFTnFhvMZXmecdo",
    authDomain: "miniext-ulaws.firebaseapp.com",
    projectId: "miniext-ulaws",
    storageBucket: "miniext-ulaws.appspot.com",
    messagingSenderId: "365164156937",
    appId: "1:365164156937:web:026cf7daa47eb1abc200d8",
    measurementId: "G-PKM98TGE3Y"
  };

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
export const baseBucketName = 'miniext-ulaws';

/* if (isDev) {
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
} */
