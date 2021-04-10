import React, { Fragment, useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import { db } from "../firebase";
import { ShowAlphabetsHeader } from "../Alphabets/ShowAlphabetsHeader";
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Tooltip } from "@material-ui/core";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import { UserContext } from "../providers/UserProvider";
import firebase from "firebase/app";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";

import { useContext } from "react";
const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiAccordionDetails);

export default function CustomizedAccordions({ languages }) {
  const [expanded, setExpanded] = useState("panel1");
  const [langSelected, setLangSelected] = useState();
  const alphabetInitState = { alphabets: [] };
  const [alphabetsDB, setAlphabetsDB] = useState(alphabetInitState);
  const [forceRefresh, setForceRefresh] = useState(false);
  const favoritelanguagesInitState = { favoritelanguages: [] };
  const [favoritelanguages, setFavoritelanguages] = useState(
    favoritelanguagesInitState
  );

  const userObj = useContext(UserContext);
  const readAlphabetFromDB = (language) => {
    if (language) {
      const alphabetsObj = db
        .collection("languages")
        .where("name", "==", language);

      let result = alphabetsObj.get();
      result.then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          const letters = db
            .collection("languages")
            .doc(doc.id)
            .collection("letters")
            .orderBy("index", "asc")
            .get();
          letters.then((letters) => {
            letters.forEach(function (letter) {
              let letterObjJson = {
                alphabet: letter.data().alphabet
              };
              setAlphabetsDB((alphabetsDB) => ({
                alphabets: [...alphabetsDB.alphabets, letterObjJson]
              }));
            });
          });
        });
      });
    }
  };

  const readFavoriteLangFromDB = (user) => {
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
  };

  const unfavouriteThisLang = (e, lang) => {
    e.stopPropagation();

    const favoriteObj = db
      .collection("favorites")
      .doc(userObj.uid)
      .collection("languages")
      .doc(lang.name);
    favoriteObj.get().then((doc) => {
      if (doc.exists) {
        favoriteObj.update({
          isActive: false
        });
        console.log(doc.data());
      }
    });
    setForceRefresh(!forceRefresh);
  };

  const favouriteThisLang = (e, lang) => {
    e.stopPropagation();
    console.log("favouriting------->", lang);

    db.collection("favorites")
      .doc(userObj.uid)
      .collection("languages")
      .doc(lang.name)
      .set(
        {
          language: lang.name,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isActive: true
        },
        { merge: true }
      );
    setForceRefresh(!forceRefresh);
  };

  const handleChange = (panel, lang) => (event, newExpanded) => {
    // console.log("------->", lang);
    setExpanded(newExpanded ? panel : false);
    setLangSelected(lang.name);
    setFavoritelanguages(favoritelanguagesInitState);
  };
  useEffect(() => {
    if (userObj) readFavoriteLangFromDB(userObj.uid);
    readAlphabetFromDB(langSelected);
    return cleanup;
  }, [langSelected, expanded, forceRefresh]);
  const cleanup = () => {
    setLangSelected();
    setAlphabetsDB(alphabetInitState);
    setFavoritelanguages(favoritelanguagesInitState);
  };
  const history = useHistory();
  const routeChange = (lang) => {
    let path = `/draw/${lang}`;
    history.push(path);
  };
  return (
    <div>
      {/* {favoritelanguages.favoritelanguages.map((fav) => (
        <p>{fav}</p>
      ))} */}
      {languages.map((lang, i) => (
        <Fragment key={lang.name}>
          <Accordion
            square
            expanded={expanded === `panel + ${i + 1}`}
            onChange={handleChange(`panel + ${i + 1}`, lang)}
            disabled={!lang.enabled}
          >
            <AccordionSummary
              aria-controls={`panel + ${i + 1}d-content`}
              id={`panel + ${i + 1}d-header`}
              expandIcon={<ArrowForwardIosIcon />}
            >
              <Typography variant="h4" onClick={() => routeChange(lang.name)}>
                {lang.displayName}
                {!favoritelanguages.favoritelanguages.includes(lang.name) ? (
                  <Tooltip title="Add to favorite">
                    <StarOutlineOutlinedIcon
                      onClick={(e) => favouriteThisLang(e, lang, userObj.uid)}
                    ></StarOutlineOutlinedIcon>
                  </Tooltip>
                ) : (
                  <Tooltip title="Remove from favorite">
                    <StarOutlinedIcon
                      onClick={(e) => unfavouriteThisLang(e, lang, userObj.uid)}
                    ></StarOutlinedIcon>
                  </Tooltip>
                )}
              </Typography>
              {/* <Typography
                styles={{ float: "right" }}
                onClick={() => routeChange(lang.name)}
              >
                <ArrowForwardIosIcon />
              </Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {alphabetsDB.alphabets && (
                  <ShowAlphabetsHeader
                    alphabets={alphabetsDB.alphabets}
                    lang={lang.name}
                  />
                )}
                {/* {alphabetsDB.alphabets} */}
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={5}
            >
              <Grid item>
                <Link className="language" to={`/draw/${lang.name}`}>
                  <Typography variant="h4">
                    <ListIcon fontSize="small" />{" "}
                    {lang.displayName
                      ? lang.displayName
                      : lang.name.toUpperCase()}
                  </Typography>
                </Link>
              </Grid>
            </Grid> */}
        </Fragment>
      ))}
    </div>
  );
}
