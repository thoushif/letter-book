import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import UserProvider from "./components/providers/UserProvider";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>,
  rootElement
);
