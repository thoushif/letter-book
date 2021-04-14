export const configurations = () => {
  console.log("NODE_ENV", process.env.NODE_ENV);
  const firebaseConfig = {
    apiKey: "AIzaSyCtC3fr-3ZUNY1ZViFimVZts3EvZMpmtfw",
    authDomain: "clean-ly-1549911706182.firebaseapp.com",
    projectId: "clean-ly-1549911706182",
    storageBucket: "clean-ly-1549911706182.appspot.com",
    messagingSenderId: "850990738516",
    appId: "1:850990738516:web:4ee087eb64d24c4ec2d1c1",
    measurementId: "G-DFRSGDFBH9"
  };

  if (process.env.NODE_ENV === "development") {
    return firebaseConfig;
  } else if (process.env.NODE_ENV === "production") {
    return firebaseConfig;
  }
};
