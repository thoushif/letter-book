import { Button, CircularProgress, Typography } from "@material-ui/core";
import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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

    const favoriteLetters = db
      .collection("favorites")
      .doc(user)
      .collection("letters")
      .get();
    favoriteLetters.then((favoriteLetters) => {
      // console.log("favoriteLang", favoriteLang);
      favoriteLetters.forEach(function (favoriteLetter) {
        if (favoriteLetter.data().isActive) {
          let favObj = {
            favletter: favoriteLetter.data().letter,
            favlang: favoriteLetter.data().lang
          };
          setFavoriteLetters((favoriteletters) => ({
            favoriteLetters: [...favoriteletters.favoriteLetters, favObj]
          }));
        }
      });
    });
    Promise.all([favoriteLetters]).then(() => {
      console.log("loading letters------finished->");
      setLoadingFavLetters(false);
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
          <img src={userObj.photoURL} alt="profile" />
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
          <Button key={fav}>
            <Typography
              variant="h4"
              color="primary"
              onClick={() => routeChange(fav)}
            >
              {fav}
            </Typography>
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
        favoriteLetters.favoriteLetters.map((fav) => (
          <Button key={fav.favletter}>
            <Typography
              variant="h4"
              color="primary"
              onClick={() => routeChange(fav.favlang, fav.favletter)}
            >
              {fav.favletter}
            </Typography>
          </Button>
        ))
      ) : (
        <NoFavoriteLetter />
      )}
    </div>
  );
};

const NoFavoriteLanguage = () => (
  <Fragment>
    <Typography color="secondary">Not yet favorited any! See how!!</Typography>

    <Typography gutterBottom variant="h4" color="textSecondary">
      English <StarOutlineOutlinedIcon /> <ArrowBackIcon className="flasher" />
    </Typography>
  </Fragment>
);

const NoFavoriteLetter = () => (
  <Fragment>
    <Typography color="secondary">Not yet favorited any! See how!!</Typography>

    <Typography gutterBottom variant="h4" color="textSecondary">
      A <StarOutlineOutlinedIcon /> <ArrowBackIcon className="flasher" />
    </Typography>
  </Fragment>
);
