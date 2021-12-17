import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCWmiA2NzjwHp7ZOBNIACrDnydcXiSmYxY',
  authDomain: 'travelstory-335116.firebaseapp.com',
  projectId: 'travelstory-335116',
  storageBucket: 'travelstory-335116.appspot.com',
  messagingSenderId: '364412437059',
  appId: '1:364412437059:web:8cc44aaaaa70d9e262caf6',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();
// firebase.firestore().settings({experimentalForceLongPolling: true});

const auth = getAuth();

export {db, auth};

// *** THIS WHOLE FILE IS NOT NEEDED!
