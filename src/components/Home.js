import { Fragment, useContext, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { db } from "./firebase";

import ReadAlphabets from "./Alphabets/ReadAlphabets";
import firebase from "firebase/app";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Languages from "./Languages";
import { UserContext } from "./providers/UserProvider";
import ReactPlayer from "react-player";

import ShowNames from "./ShowNames/ShowNames";
import LetterPreview from "./ShowNames/LetterPreview";
import {
  Avatar,
  Button,
  ButtonGroup,
  Typography,
  withStyles
} from "@material-ui/core";
import { HeaderLogo } from "./Header/HeaderLogo";
import { Favorites } from "./HomeLanugages/Favorites";

export default function Home({ user }) {
  useEffect(() => {
    if (user) {
      const canvasDBObj = db.collection("users").doc(user.uid);
      canvasDBObj.get().then((doc) => {
        if (!doc.exists) {
          db.collection("users").doc(user.uid).set({
            userId: user.uid,
            userName: user.displayName,
            photoURL: user.photoURL,
            loggedInAt: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true
          });
        }
      });
    }
  }, [user]);
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

        <ButtonGroup variant="outlined" className="floatRight">
          <Button size="small" component={Link} to={`/draw`}>
            <Typography
              variant="caption"
              style={{
                textDecoration: "none",
                color: "black",
                textShadow: "0px 0px 15px  #FFFFFF"
              }}
            >
              ALL LANGUAGES
            </Typography>
          </Button>
          <Button
            // variant="contained"
            color="primary"
            size="small"
            className="floatRight"
            component={Link}
            to={"/profile"}
          >
            <Avatar
              styles={{ width: "10%" }}
              alt={user.displayName}
              src={user.photoURL}
            />

            {/* <MenuBookIcon color="action" /> */}
          </Button>{" "}
          <Button variant="contained" size="small" onClick={logOut}>
            <ExitToAppIcon color="secondary" />
          </Button>
        </ButtonGroup>
        <WhiteTextTypography variant="h4" color="secondary">
          Hi {user.displayName} !{" "}
        </WhiteTextTypography>

        {/* <MenuItemContainer> */}
        {/* <Link to="/see-your-name">See Your Name</Link> */}
        {/* <LanguageItem key="all-languages">
            
          </LanguageItem> */}
        {/* </MenuItemContainer> */}
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
const WhiteTextTypography = withStyles({
  root: {
    color: "black",
    textShadow: "0px 0px 15px  #FFFFFF",
    fontSize: "1.5em"
  }
})(Typography);
// Draw Page
const Draw = () => <Fragment> {<Languages />}</Fragment>;

export const SiteDetails = ({ signinPage }) => (
  <Fragment>
    <Typography variant="body1" gutterBottom></Typography>
    <WhiteTextTypography variant="body1" color="textSecondary" gutterBottom>
      The Place where you can show how do you draw the letters of your language
    </WhiteTextTypography>
    <WhiteTextTypography variant="body1" gutterBottom>
      If you start learning new language, put in the drawing and seek the
      quality of your letter
    </WhiteTextTypography>
    <Typography variant="body1" gutterBottom>
      {!signinPage && <Languages />}
    </Typography>
    <ReactPlayer
      width="400"
      playing
      loop
      url="https://letterbook.s3.us-east-2.amazonaws.com/Homepage.MOV"
    />
  </Fragment>
);

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

const LanguageItem = styled.div`
  height: 30px;
  color: white;
  text-align: center;
  vertical-align: center;
  font-size: 150%;
  padding-right: 10px;
  margin-bottom: 30px;
`;
