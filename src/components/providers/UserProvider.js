import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "firebase/app";

export const UserContext = createContext({ user: null });
export default function UserProvider(props) {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setCurrentUser(userAuth);
      if (userAuth) {
        console.log("in authhhhhhhhhhh", userAuth);
        const canvasDBObj = db.collection("users").doc(userAuth.uid);
        canvasDBObj.get().then((doc) => {
          if (doc.exists) {
            canvasDBObj.update(
              {
                loggedInAt: firebase.firestore.FieldValue.serverTimestamp()
              },
              { merge: true }
            );
          } else {
            db.collection("users").doc(userAuth.uid).set({
              userId: userAuth.uid,
              userName: userAuth.displayName,
              photoURL: userAuth.photoURL,
              loggedInAt: firebase.firestore.FieldValue.serverTimestamp(),
              isActive: true
            });
          }
        });
      }
    });
  }, []);
  return (
    <UserContext.Provider value={currentUser}>
      {props.children}
    </UserContext.Provider>
  );
}
