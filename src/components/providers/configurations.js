export const configurations = () => {
  if (process.env.NODE_ENV === "development") {
    return {
      apiKey: "AIzaSyCtC3fr-3ZUNY1ZViFimVZts3EvZMpmtfw",
      authDomain: "clean-ly-1549911706182.firebaseapp.com",
      projectId: "clean-ly-1549911706182",
      storageBucket: "clean-ly-1549911706182.appspot.com",
      messagingSenderId: "850990738516",
      appId: "1:850990738516:web:4ee087eb64d24c4ec2d1c1",
      measurementId: "G-DFRSGDFBH9"
    };
  } else if (process.env.NODE_ENV === "production") {
    return {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId
    };
  }
};
