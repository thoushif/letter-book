import MailIcon from "@material-ui/icons/Mail";
import styled from "styled-components";
import {
  Avatar,
  Button,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import BrushIcon from "@material-ui/icons/Brush";

export const Favorites = () => {
  const userObj = useContext(UserContext);

  const [loadingFavLangs, setLoadingFavLangs] = useState(false);
  const [loadingFavLetters, setLoadingFavLetters] = useState(false);

  const favoriteLettersInitState = { favoriteLetters: [] };
  const [favoriteLetters, setFavoriteLetters] = useState(
    favoriteLettersInitState
  );
  const readFavoriteLettersFromDB = (user) => {
    setLoadingFavLetters(true);
    setFavoriteLetters(favoriteLettersInitState);

    db.collection("languages")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log("yyyyyyyyy", doc.data());

          if (doc.data().enabled) {
            const favoriteLetters = db
              .collection("favorites")
              .doc(user)
              .collection("languages")
              .doc(doc.data().name)
              .collection("letters")
              .get();
            favoriteLetters.then((favoriteLetters) => {
              console.log("favoriteLetters", favoriteLetters);
              favoriteLetters.forEach(function (favoriteLetter) {
                if (favoriteLetter.data().isActive) {
                  let favObj = {
                    favletter: favoriteLetter.data().letter,
                    favlang: favoriteLetter.data().lang
                  };
                  console.log("favObj", favObj);
                  setFavoriteLetters((favoriteletters) => ({
                    favoriteLetters: [
                      ...favoriteletters.favoriteLetters,
                      favObj
                    ]
                  }));
                }
              });
            });
          }
        });
        setLoadingFavLetters(false);

        // let lng = [];
        // lng = snapshot.docs.map((doc) => doc.data()).map((e) => e);
        // console.log("abbbbbbbbbbbbbbbbbbbbbbbbbbbb", lng);
      });

    // const favoriteLetters = db
    //   .collection("favorites")
    //   .doc(user)
    //   .collection("lanugages")
    //   .doc("english")
    //   .collection("letters")
    //   .get();
    // favoriteLetters.then((favoriteLetters) => {
    //   // console.log("favoriteLang", favoriteLang);
    //   favoriteLetters.forEach(function (favoriteLetter) {
    //     if (favoriteLetter.data().isActive) {
    //       let favObj = {
    //         favletter: favoriteLetter.data().letter,
    //         favlang: favoriteLetter.data().lang
    //       };
    //       setFavoriteLetters((favoriteletters) => ({
    //         favoriteLetters: [...favoriteletters.favoriteLetters, favObj]
    //       }));
    //     }
    //   });
    // });
    // Promise.all([favoriteLetters]).then(() => {
    //   console.log("loading letters------finished->");
    //   setLoadingFavLetters(false);
    // });
  };
  const favoriteBrushInitState = {
    color: { hex: "#000000" },
    size: "medium"
  };

  const [favoriteBrush, setFavoriteBrush] = useState(favoriteBrushInitState);
  const readFavoriteBrushFromDB = (user) => {
    setFavoriteBrush(favoriteBrushInitState);
    const dbFav = db
      .collection("favorites")
      .doc(user)
      .collection("brush")
      .doc("color-size")
      .get();
    dbFav.then((favoriteBrushDB) => {
      console.log("favoriteBrush=====", favoriteBrushDB.data());
      if (
        favoriteBrushDB !== undefined &&
        favoriteBrushDB.data() !== undefined
      ) {
        let favBrush = {
          color: {
            hex: favoriteBrushDB.data().color
          },
          size: favoriteBrushDB.data().size
        };
        setFavoriteBrush(favBrush);
      }
    });
  };
  const favoritelanguagesInitState = { favoritelanguages: [] };
  const [favoritelanguages, setFavoritelanguages] = useState(
    favoritelanguagesInitState
  );

  const readFavoriteLangFromDB = (user) => {
    setLoadingFavLangs(true);
    setFavoritelanguages(favoritelanguagesInitState);

    const favoriteLangs = db
      .collection("favorites")
      .doc(user)
      .collection("languages")
      .get();
    favoriteLangs.then((favoriteLang) => {
      // console.log("favoriteLang", favoriteLang);
      favoriteLang.forEach(function (favoriteLang) {
        if (favoriteLang.data().isActive) {
          setFavoritelanguages((favoritelanguages) => ({
            favoritelanguages: [
              ...favoritelanguages.favoritelanguages,
              favoriteLang.data().language
            ]
          }));
        }
      });
    });
    Promise.all([favoriteLangs]).then(() => {
      console.log("loading------finished->");
      setLoadingFavLangs(false);
    });
  };
  const history = useHistory();
  const routeChange = (lang, letter) => {
    let path = letter ? `/draw/${lang}/${letter}` : `/draw/${lang}`;
    history.push(path);
  };
  useEffect(() => {
    if (userObj) {
      console.log(userObj);
      readFavoriteLangFromDB(userObj.uid);

      readFavoriteLettersFromDB(userObj.uid);
      readFavoriteBrushFromDB(userObj.uid);
    }
    return cleanup;
  }, []);
  const cleanup = () => {
    setFavoritelanguages(favoritelanguagesInitState);
    setFavoriteLetters(favoriteLettersInitState);
    setLoadingFavLetters(false);
    setLoadingFavLangs(false);
  };

  return (
    <div>
      {userObj && (
        <div>
          <Avatar alt={userObj.displayName} src={userObj.photoURL} />
          <Typography>{userObj.email}</Typography>
        </div>
      )}
      <Typography gutterBottom variant="h5">
        Favorite Languages
      </Typography>
      {loadingFavLangs ? (
        <CircularProgress />
      ) : favoritelanguages.favoritelanguages.length > 0 ? (
        favoritelanguages.favoritelanguages.map((fav) => (
          <Button
            variant="contained"
            key={fav}
            onClick={() => routeChange(fav)}
          >
            <Typography color="primary">{fav}</Typography>
          </Button>
        ))
      ) : (
        <NoFavoriteLanguage />
      )}
      <Typography gutterBottom variant="h5">
        Favorite Letters
      </Typography>
      {loadingFavLetters ? (
        <CircularProgress />
      ) : favoriteLetters.favoriteLetters.length > 0 ? (
        <Fragment>
          {favoriteLetters.favoriteLetters.map((fav) => (
            <Button
              key={fav.favletter}
              variant="contained"
              onClick={() => routeChange(fav.favlang, fav.favletter)}
            >
              {fav.favlang}
              {"-"}
              <Typography variant="h4" color="primary">
                {fav.favletter}
              </Typography>
            </Button>
          ))}
        </Fragment>
      ) : (
        <NoFavoriteLetter />
      )}
      <Typography gutterBottom variant="h5">
        Favorite Brush Color/Size:
      </Typography>
      <Button variant="contained">
        <BrushIcon
          fontSize={
            favoriteBrush.size !== 2
              ? favoriteBrush.size === 4
                ? "medium"
                : "large"
              : "small"
          }
          style={{ fill: favoriteBrush.color.hex }}
        />
      </Button>
      <FooterContainer>
        <Typography gutterBottom>
          Designed and Developed by
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/thoushifaazam"
          >
            {" "}
            Thoushif
          </a>
        </Typography>
        <Typography variant="caption">
          <a href="mailto:a.complete.letterbook@gmail.com">
            <MailIcon fontSize="small" />
          </a>
          Any bugs, suggestions
        </Typography>{" "}
      </FooterContainer>
    </div>
  );
};

const NoFavoriteLanguage = () => (
  <Fragment>
    <Typography color="secondary">
      Not yet favorited any! Go home to see languages, and then!!
    </Typography>

    <Typography gutterBottom variant="h4" color="textSecondary">
      English <StarOutlineOutlinedIcon /> <ArrowBackIcon className="flasher" />
    </Typography>
    <Typography gutterBottom variant="h4" color="textSecondary">
      Telugu
    </Typography>
  </Fragment>
);

const NoFavoriteLetter = () => (
  <Fragment>
    <Typography color="secondary">
      Not yet favorited any! Go to a particular letter and then!!
    </Typography>

    <Typography gutterBottom variant="h4" color="textSecondary">
      A <StarOutlineOutlinedIcon /> <ArrowBackIcon className="flasher" />
    </Typography>
    <Typography gutterBottom variant="h4" color="textSecondary">
      B
    </Typography>
  </Fragment>
);

const FooterContainer = styled.div`
  /* right: 0; */
  margin: auto;
  position: absolute;
  bottom: 0;
  /* left: 0; */
  /* padding: 2rem; */
  background-image: linear-gradient(grey, white);
  text-align: center;
`;
