// GraniteSky Dispatch Center - Firebase Setup

const firebaseConfig = {
  apiKey: "AIzaSyB0wyZSi3m-iOfev8t8UcnfwFcik3nZW4o",
  authDomain: "granitesky-dispatch-center.firebaseapp.com",
  projectId: "granitesky-dispatch-center",
  storageBucket: "granitesky-dispatch-center.firebasestorage.app",
  messagingSenderId: "457881488943",
  appId: "1:457881488943:web:d589320918ef21c89880da",
  measurementId: "G-6X2RLT7H1B"
};

firebase.initializeApp(firebaseConfig);

const gsAuth = firebase.auth();
const gsDb = firebase.firestore();
