import { Fragment, useContext } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import ReadAlphabets from "./Alphabets/ReadAlphabets";
import { logOut } from "./firebase";
import Languages from "./Languages";
import { UserContext } from "./providers/UserProvider";

import ShowNames from "./ShowNames/ShowNames";
import LetterPreview from "./ShowNames/LetterPreview";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import { Typography } from "@material-ui/core";
import { HeaderLogo } from "./Header/HeaderLogo";

export default function Home() {
  const user = useContext(UserContext);
  return (
    <Router>
      <Container>
        <Link className="name-title" to="/">
          <HeaderLogo />
          {/* <MenuBookIcon color="action" /> */}
        </Link>
        <Button className="logout" onClick={logOut}>
          Logout
        </Button>
        <Typography variant="subtitle1">Hi {user.displayName} !</Typography>
        <MenuItemContainer>
          {/* <Link to="/see-your-name">See Your Name</Link> */}
          {/* <LanguageItem key="all-languages">
            <Link className="language" to={`/draw`}>
              ALL LANGUAGES
            </Link>
          </LanguageItem> */}
        </MenuItemContainer>
        <Switch>
          <Route path="/" exact component={Header} />
          <Route path="/see-your-name/:lang" component={ShowNames} />
          <Route path="/draw/:lang/:letter" component={LetterPreview} />
          <Route path="/draw/:lang" component={ReadAlphabets} />
          <Route path="/draw" component={Draw} />
          <Route render={() => <h1>404: page not found</h1>} />
        </Switch>
      </Container>
    </Router>
  );
}
// Home Page
const Header = () => (
  <Fragment>
    <SiteDetails />
  </Fragment>
);
// Draw Page
const Draw = () => (
  <Fragment>
    {" "}
    <Languages />
  </Fragment>
);

export const SiteDetails = () => (
  <Fragment>
    <Typography variant="body1" gutterBottom></Typography>
    <Typography variant="body1" gutterBottom>
      The Place where you can show how do you draw the letters of your language
    </Typography>
    <Typography variant="body1" gutterBottom>
      If you start learning new language, put in the drawing and seek the
      quality of your letter
    </Typography>
    <Typography variant="body1" gutterBottom>
      <Languages />
    </Typography>
  </Fragment>
);

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;

  float: right;
`;
const Container = styled.div`
  /* trbl */
  margin: 0 250px 10px 250px;
  @media (max-width: 1000px) {
    flex-direction: column;
    margin: 0 50px 10px 50px;
  }
  /* display: inline-flex; */
`;

const MenuItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LanguageItem = styled.div`
  height: 30px;
  color: white;
  text-align: center;
  vertical-align: center;
  font-size: 150%;
  padding-right: 10px;
  margin-bottom: 30px;
`;
