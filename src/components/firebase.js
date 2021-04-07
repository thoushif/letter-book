import firebase from "firebase/app";
// import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "@firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtC3fr-3ZUNY1ZViFimVZts3EvZMpmtfw",
  authDomain: "clean-ly-1549911706182.firebaseapp.com",
  projectId: "clean-ly-1549911706182",
  storageBucket: "clean-ly-1549911706182.appspot.com",
  messagingSenderId: "850990738516",
  appId: "1:850990738516:web:4ee087eb64d24c4ec2d1c1",
  measurementId: "G-DFRSGDFBH9"
};

// firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
const db = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  promt: "select_account"
});
export const logOut = () => {
  const result = window.confirm("Are you sure you want to logout?");
  if (result) {
    auth
      .signOut()
      .then(() => {
        console.log("logged out");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
};
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export { db };
