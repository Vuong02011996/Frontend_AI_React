// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/analytics';

// auth dùng để xác thực
import 'firebase/auth';
// realtime database
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBy6sGdGEDol4IFHIUO_xS4F4nvWssbo8E',
    authDomain: 'clovertest-a103f.firebaseapp.com',
    projectId: 'clovertest-a103f',
    storageBucket: 'clovertest-a103f.appspot.com',
    messagingSenderId: '277097869892',
    appId: '1:277097869892:web:e5a6485515d76e32c24211',
    measurementId: 'G-G0JEMFTJ23',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth(); // https://firebase.google.com/docs/auth/web/facebook-login#web-version-8_4
const db = firebase.firestore(); // https://firebase.google.com/docs/firestore/quickstart#web-version-8

// Config sử dụng DB dưới local
// auth.useEmulator('http://localhost:9099');
// if (window.location.hostname === 'localhost') {
//     db.useEmulator('localhost', '8080');
// }

export { db, auth };
export default firebase;
