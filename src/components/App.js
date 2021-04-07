import React, { Fragment, useContext } from "react";
import Home from "./Home";
import { UserContext } from "./providers/UserProvider";
import Signin from "./providers/Signin";
export default function App() {
  const user = useContext(UserContext);
  return <Fragment>{!user ? <Signin /> : <Home />}</Fragment>;
}
