import MousePaintPreview from "../MousePaintPreview";
import styled from "styled-components";
import Languages from "../Languages";
import { Button, Chip, Grid, Tooltip, Typography } from "@material-ui/core";
import { Voice } from "../Alphabets/Voice";
import { Usage } from "../Alphabets/Usage";
import { db } from "../firebase";
import { useContext, useEffect, useState } from "react";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import { UserContext } from "../providers/UserProvider";
import firebase from "firebase/app";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";
import { useHistory } from "react-router-dom";
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@material-ui/icons/KeyboardArrowRightRounded";
// import background from "../src/data/blank-open-book.jpg";

export default function LetterPreview({ lang, letter }) {
  const alphabetsLangObj = db.collection("languages");
  const alphabetsObj = db.collection("languages").where("name", "==", lang);
  const userObj = useContext(UserContext);
  const [forceRefresh, setForceRefresh] = useState(false);
  const favoriteLettersInitState = { favoriteLetters: [] };
  const [favoriteLetters, setFavoriteLetters] = useState(
    favoriteLettersInitState
  );
  const [alphabetsDB, setAlphabetsDB] = useState({});
  const [nextAlphabetsDB, setNextAlphabetsDB] = useState({});
  const [prevAlphabetsDB, setPrevAlphabetsDB] = useState({});
  const history = useHistory();
  const routeChange = (lang, alphabet) => {
    let path = `/draw/${lang}/${alphabet}`;
    history.push(path);
  };
  const readAlphabetFromDB = (lettersFiltered) => {
    // console.log("===========>", lettersFiltered);
    let result = alphabetsObj.get();
    result.then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        const letters = lettersFiltered
          ? alphabetsLangObj
              .doc(doc.id)
              .collection("letters")
              .where("alphabet", "==", lettersFiltered)
              .get()
          : alphabetsLangObj.doc(doc.id).collection("letters").get();
        letters.then((letters) => {
          letters.forEach(function (letter) {
            // console.log(letter.data());
            let letterObjJson = {
              usage: letter.data().usage,
              index: letter.data().index,
              type: letter.data().type,
              alphabet: letter.data().alphabet,
              pronunciationAudioSrc: letter.data().pronunciationAudioSrc
            };
            setAlphabetsDB(letterObjJson);

            const nextLetterIndex = letter.data().index + 1;
            const nextLetterObj = alphabetsLangObj
              .doc(doc.id)
              .collection("letters")
              .where("index", "==", nextLetterIndex)
              .get();
            nextLetterObj.then((nextLetters) => {
              nextLetters.forEach(function (nextLetter) {
                let letterObjJson = {
                  alphabet: nextLetter.data().alphabet
                };
                setNextAlphabetsDB(letterObjJson);
              });
            });
            //prev letter obj
            const prevLetterIndex = letter.data().index - 1;
            const prevLetterObj = alphabetsLangObj
              .doc(doc.id)
              .collection("letters")
              .where("index", "==", prevLetterIndex)
              .get();
            prevLetterObj.then((prevLetters) => {
              prevLetters.forEach(function (prevLetter) {
                let letterObjJson = {
                  alphabet: prevLetter.data().alphabet
                };
                setPrevAlphabetsDB(letterObjJson);
              });
            });
          });
        });
      });
    });
  };
  const langInitState = { name: "", displayName: "" };
  const [langDB, setLangDB] = useState(langInitState);
  const readLangFromDB = () => {
    let result = alphabetsObj.get();
    result.then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        let langDBObj = {
          name: doc.data().name,
          displayName: doc.data().displayName,
          types: doc.data().types
        };
        setLangDB(langDBObj);
      });
    });
  };
  const readFavoriteLettersFromDB = (user) => {
    setFavoriteLetters(favoriteLettersInitState);

    const favoriteLetters = db
      .collection("favorites")
      .doc(user)
      .collection("languages")
      .doc(lang)
      .collection("letters")
      .get();
    favoriteLetters.then((favoriteLetters) => {
      // console.log("favoriteLang", favoriteLang);
      favoriteLetters.forEach(function (favoriteLetter) {
        if (favoriteLetter.data().isActive) {
          setFavoriteLetters((favoriteletters) => ({
            favoriteLetters: [
              ...favoriteletters.favoriteLetters,
              favoriteLetter.data().letter
            ]
          }));
        }
      });
    });
  };
  const unfavouriteThisLetter = (e, letter) => {
    e.stopPropagation();

    const favoriteObj = db
      .collection("favorites")
      .doc(userObj.uid)
      .collection("languages")
      .doc(lang)
      .collection("letters")
      .doc(letter)
      .get();
    favoriteObj.then((doc) => {
      if (doc.exists) {
        db.collection("favorites")
          .doc(userObj.uid)
          .collection("languages")
          .doc(lang)
          .collection("letters")
          .doc(letter)
          .update({
            isActive: false
          });
        // console.log(doc.data());
      }
    });
    setForceRefresh(!forceRefresh);
    Promise.all([favoriteObj]).then(() => {
      // console.log("un favouriting------finished->");
      setForceRefresh((forceRefresh) => !forceRefresh);
    });
  };

  const favouriteThisLetter = (e, letter) => {
    e.stopPropagation();
    db.collection("favorites")
      .doc(userObj.uid)
      .collection("languages")
      .doc(lang)
      .set(
        {
          language: lang,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          isActive: true
        },
        { merge: true }
      );

    db.collection("favorites")
      .doc(userObj.uid)
      .collection("languages")
      .doc(lang)
      .collection("letters")
      .doc(letter)
      .set(
        {
          letter: letter,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lang: lang,
          isActive: true
        },
        { merge: true }
      );

    setForceRefresh(!forceRefresh);
  };

  useEffect(() => {
    if (userObj) readFavoriteLettersFromDB(userObj.uid);
    readAlphabetFromDB(letter);
    readLangFromDB();
    return cleanup;
  }, [letter, forceRefresh]);

  const cleanup = () => {
    setNextAlphabetsDB({});
    setPrevAlphabetsDB({});
  };

  // return <MousePaintPreview lang={lang} letter={letter} />;
  return (
    <MousePaintPreviewContainer>
      <Languages languageprop={lang}>
        Showing '{letter}' in {langDB.displayName}.
        <Button>Show All letters</Button>
      </Languages>

      {/* <MousePaintPreviewItem>
                          <Grid container spacing={0} justify="space-evenly" alignItems="center">
                            {  <Grid key={lang + letter + "letter"} item xs="1">
                              <div>
                                <span className="letter-head">{letter}</span>
                              </div>
                            </Grid>  }
                            <Grid key={lang + letter + "letter"} item xs="5">
                              <div>
                                <span className="letter-head">{letter}</span>
                                <Typography>Type: </Typography>
                                <Typography>Language: {lang}</Typography>
                                <Typography>
                                  Sound: <Voice letter={letter} lang={lang} />
                                </Typography>
                                <Typography>
                                  Usage: <Usage letter={letter} lang={lang} />
                                </Typography>
                              </div>
                            </Grid>
                            <Grid key={lang + letter + "canvas"} item xs="5">
                              <MousePaintPreview lang={lang} letter={letter} />
                            </Grid>
                          </Grid>
                          { {letter}

                        <MousePaintPreviewItem key={lang + letter}>
                          <MousePaintPreview lang={lang} letter={letter} />
                        </MousePaintPreviewItem>  }
                        </MousePaintPreviewItem> */}
      <MousePaintPreviewItem key={lang + alphabetsDB.alphabet}>
        <Grid
          container
          spacing={0}
          justify="center"
          alignItems="stretch"
          direction="row"
          styles={{ backgroundImage: `url(${"../data/blank-open-book.jpg"})` }}
        >
          <Grid
            alignItems="center"
            key={lang + alphabetsDB.alphabet + "letter"}
            item
            xs="5"
            className="bookborder-left"
          >
            {prevAlphabetsDB && prevAlphabetsDB.alphabet && (
              <Chip
                key={prevAlphabetsDB.alphabet}
                color="default"
                label={prevAlphabetsDB.alphabet.toUpperCase()}
                avatar={<KeyboardArrowLeftRoundedIcon />}
                size="medium"
                // deleteIcon={<ClearIcon />}
                onClick={() => routeChange(lang, prevAlphabetsDB.alphabet)}
                // onDelete={() => deletethisAlphabet(lang, alphabet)}
                // avatar={<Avatar>{alphabet.toUpperCase()}</Avatar>}
              />
            )}
            <div className="leftpage">
              <span className="letter-head-preview">
                {alphabetsDB.alphabet}
              </span>

              {!favoriteLetters.favoriteLetters.includes(
                alphabetsDB.alphabet
              ) ? (
                <Tooltip title="Add to favorite">
                  <StarOutlineOutlinedIcon
                    onClick={(e) =>
                      favouriteThisLetter(e, alphabetsDB.alphabet)
                    }
                  ></StarOutlineOutlinedIcon>
                </Tooltip>
              ) : (
                <Tooltip title="Remove from favorite">
                  <StarOutlinedIcon
                    onClick={(e) =>
                      unfavouriteThisLetter(e, alphabetsDB.alphabet)
                    }
                  ></StarOutlinedIcon>
                </Tooltip>
              )}
              {/* 
              <Tooltip title="Add to favorite">
                <StarOutlineOutlinedIcon
                  onClick={(e) => favouriteThisLetter(e, alphabetsDB.alphabet)}
                ></StarOutlineOutlinedIcon>
              </Tooltip> */}
              <Typography>Type: {alphabetsDB.type} </Typography>
              <Typography>Language: {langDB.displayName}</Typography>
              <Typography>
                Sound:{" "}
                <Voice
                  pronunciationAudioSrc={alphabetsDB.pronunciationAudioSrc}
                  lang={lang}
                />
              </Typography>
              <Typography>
                Usage: <Usage content={alphabetsDB.usage} />
              </Typography>
              <MousePaintPreview lang={lang} letter={alphabetsDB.alphabet} />
            </div>
          </Grid>
          <Grid
            key={lang + alphabetsDB.alphabet + "canvas"}
            item
            xs={5}
            className="bookborder-right height-check"
          >
            <div
              className="floatRight"
              onClick={() => routeChange(lang, nextAlphabetsDB.alphabet)}
            >
              {nextAlphabetsDB && nextAlphabetsDB.alphabet && (
                <Chip
                  key={nextAlphabetsDB.alphabet}
                  color="default"
                  label={nextAlphabetsDB.alphabet.toUpperCase()}
                  size="medium"
                  avatar={<KeyboardArrowRightRoundedIcon />}
                  // deleteIcon={<ClearIcon />}
                  onClick={() => routeChange(lang, nextAlphabetsDB.alphabet)}
                  // onDelete={() => deletethisAlphabet(lang, alphabet)}
                  // avatar={<Avatar>{alphabet.toUpperCase()}</Avatar>}
                >
                  {" "}
                  <KeyboardArrowLeftRoundedIcon />
                </Chip>
              )}
            </div>
            <MousePaintPreview
              lang={lang}
              letter={alphabetsDB.alphabet}
              showOthers
            />
          </Grid>
        </Grid>
      </MousePaintPreviewItem>
    </MousePaintPreviewContainer>
  );
}

const MousePaintPreviewContainer = styled.div`
  /* display: flex; */
  /* margin: 10px auto; */
`;
const MousePaintPreviewItem = styled.div`
  box-shadow: 0px 2px 2px 2px grey;
  border-radius: 5px;
  font-size: 120%;
  padding: 20px;
  background-color: white;
  margin: 20px auto;
  padding: 20px;
  :hover {
    background-color: #ebf7ee;
  }
`;
