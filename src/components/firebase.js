import firebase from "firebase/app";
// import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "@firebase/firestore";
import { configurations } from "./providers/configurations";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log("=====>", configurations());
const firebaseConfig = configurations();

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
