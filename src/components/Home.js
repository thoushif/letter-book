import { Fragment, useContext } from "react";
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory
} from "react-router-dom";
import ReadAlphabets from "./Alphabets/ReadAlphabets";
import firebase from "firebase/app";

import Languages from "./Languages";
import { UserContext } from "./providers/UserProvider";

import ShowNames from "./ShowNames/ShowNames";
import LetterPreview from "./ShowNames/LetterPreview";
import { Button, Typography } from "@material-ui/core";
import { HeaderLogo } from "./Header/HeaderLogo";
import { Favorites } from "./HomeLanugages/Favorites";

export default function Home() {
  const user = useContext(UserContext);
  const history = useHistory();

  const logOut = () => {
    const result = window.confirm("Are you sure you want to logout?");
    if (result) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("logged out");
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  return (
    <Router>
      <Container>
        <Link className="name-title" to="/">
          <HeaderLogo />
          {/* <MenuBookIcon color="action" /> */}
        </Link>
        <LogoutButton onClick={logOut}>Logout</LogoutButton>
        <Button className="floatRight" component={Link} to={"/profile"}>
          Profile
          {/* <MenuBookIcon color="action" /> */}
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
          <Route
            path="/draw/:lang/:letter"
            render={({ match }) => (
              <LetterPreview
                lang={match.params.lang}
                letter={match.params.letter}
              />
            )}
            // component={LetterPreview}
          />
          <Route path="/draw/:lang" component={ReadAlphabets} />
          <Route path="/profile" component={Favorites} />
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
// Home Page

// Draw Page
const Draw = () => <Fragment> {<Languages />}</Fragment>;

export const SiteDetails = ({ signinPage }) => (
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
      {!signinPage && <Languages />}
    </Typography>
  </Fragment>
);

const LogoutButton = styled.button`
  background: transparent;
  border: 2px solid palevioletred;
  border-radius: 3px;
  color: palevioletred;
  margin: 0 1em;
  padding: 0.25em 1em;
  float: right;
`;

const FavoritesButton = styled.button`
  background: transparent;
  border: 2px solid palevioletred;
  border-radius: 3px;
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
  @media (max-width: 400px) {
    flex-direction: column;
    margin: 0 0px 10px 0px;
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
