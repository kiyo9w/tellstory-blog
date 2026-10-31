import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAzqsiysIIPuTBwrsyufLal7A1EmDUcU0s',
  authDomain: 'tellstory-blog.firebaseapp.com',
  projectId: 'tellstory-blog',
  storageBucket: 'tellstory-blog.firebasestorage.app',
  messagingSenderId: '20481686029',
  appId: '1:20481686029:web:86e2ceda0d85a08ee07344',
  measurementId: 'G-C8XEHNC3N9'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);