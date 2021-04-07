import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Header } from "./components/Header/Header";
import App from "./components/App";
import UserProvider from "./components/providers/UserProvider";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <UserProvider>
      <Header />
      <App className="App" />
    </UserProvider>
  </StrictMode>,
  rootElement
);
