import "../../styles.css";
import { Fragment, useContext, useEffect, useState } from "react";
import { ShowAlphabetsHeader } from "./ShowAlphabetsHeader";
import { Voice } from "./Voice";
import styled from "styled-components";
import MousePaintPreview from "../MousePaintPreview";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  ButtonGroup,
  withStyles
} from "@material-ui/core";
import { Usage } from "./Usage";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";
import { UserContext } from "../providers/UserProvider";

export default function ReadAlphabets({
  match: {
    params: { lang }
  }
}) {
  const [showOnlyDrawn, setShowOnlyDrawn] = useState("");
  const userObj = useContext(UserContext);
  // const lettersWrittenObj = db.collection("letters-written");

  const langInitState = { name: "", displayName: "" };
  const [langDB, setLangDB] = useState(langInitState);
  const readLangFromDB = () => {
    let result = alphabetsObj.get();
    result.then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        let langDBObj = {
          name: doc.data().name,
          displayName: doc.data().displayName,
          types: doc.data().types,
          pluralSymbol: doc.data().pluralSymbol
        };
        setLangDB(langDBObj);
      });
    });
  };
  const history = useHistory();
  const routeChange = (lang, alphabet) => {
    let path = `/draw/${lang}/${alphabet}`;
    history.push(path);
  };
  const favoriteLettersInitState = { favoriteLetters: [] };
  const [favoriteLetters, setFavoriteLetters] = useState(
    favoriteLettersInitState
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const alphabetInitState = { alphabets: [] };
  const [alphabetsDB, setAlphabetsDB] = useState(alphabetInitState);
  const alphabetsObj = db.collection("languages").where("name", "==", lang);
  const alphabetsLangObj = db.collection("languages");
  const readAlphabetFromDB = (type) => {
    if (showFavorites) {
      const favoriteLettersDB = db
        .collection("favorites")
        .doc(userObj.uid)
        .collection("languages")
        .doc(lang)
        .collection("letters")
        .get();
      favoriteLettersDB.then((favoriteLetters) => {
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
    }

    let letters;
    let result = alphabetsObj.get();
    result.then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        console.log(
          "favoriteLetter-readalpha",
          favoriteLetters.favoriteLetters
        );
        if (type === undefined) {
          letters = alphabetsLangObj
            .doc(doc.id)
            .collection("letters")
            .orderBy("index", "asc")
            .get();
        } else {
          letters = alphabetsLangObj
            .doc(doc.id)
            .collection("letters")
            .orderBy("index", "asc")
            .where("type", "==", type)
            .get();
        }
        // letters = type
        //   ? alphabetsLangObj
        //       .doc(doc.id)
        //       .collection("letters")
        //       .orderBy("index", "asc")
        //       .where("type", "==", type)
        //       .get()
        //   : alphabetsLangObj
        //       .doc(doc.id)
        //       .collection("letters")
        //       .orderBy("index", "asc")
        //       .get();
        letters.then((letters) => {
          letters.forEach(function (letter) {
            let letterObjJson = {
              usage: letter.data().usage,
              type: letter.data().type,
              alphabet: letter.data().alphabet,
              pronunciationAudioSrc: letter.data().pronunciationAudioSrc
            };
            setAlphabetsDB((alphabetsDB) => ({
              alphabets: [...alphabetsDB.alphabets, letterObjJson]
            }));
          });
        });
      });
    });
  };

  // .where("userId", "==", userObj.uid);
  useEffect(() => {
    if (showOnlyDrawn) {
      readAlphabetFromDB(showOnlyDrawn);
    } else {
      readAlphabetFromDB();
      readLangFromDB();
    }
    return cleanUp;
  }, [lang, showOnlyDrawn, showFavorites]);
  const cleanUp = () => {
    setAlphabetsDB(alphabetInitState);
  };
  return alphabetsDB.alphabets.length <= 0 ? (
    <CircularProgress />
  ) : (
    <div>
      <WhiteBackGroundTypography>
        Language : {langDB.displayName}
        {/* <p>Alphabets Filtered : {alphabetsFiltered.substring(1)}</p> */}
      </WhiteBackGroundTypography>
      <WhiteBackGroundTypography>
        Alphabets :{" "}
        {showOnlyDrawn ? showOnlyDrawn + langDB.pluralSymbol : "Showing all"}
        {showFavorites && " (starred)"}
      </WhiteBackGroundTypography>

      <FilterContainer>
        <ButtonGroup>
          {langDB.types &&
            langDB.types.map((type) => (
              <Button
                key={type}
                // className="floatRight"
                size="small"
                color="action"
                variant="contained"
                onClick={() => {
                  setShowFavorites(false);
                  setShowOnlyDrawn(type);
                }}
              >
                {type + langDB.pluralSymbol}
              </Button>
            ))}

          <Button
            // className="floatRight"
            size="small"
            color="action"
            variant="contained"
            onClick={() => {
              setShowFavorites(false);
              setShowOnlyDrawn();
            }}
          >
            ALL
          </Button>
          <Button
            // className="floatRight"
            size="small"
            color="action"
            variant="contained"
            onClick={() => {
              setShowFavorites(true);
            }}
          >
            <StarOutlinedIcon fontSize="small" />
          </Button>
        </ButtonGroup>
      </FilterContainer>
      <ShowAlphabetsHeader alphabets={alphabetsDB.alphabets} lang={lang} />
      {/* todo: this will be the social feed  NOT for all alphabets*/}
      <MousePaintPreviewContainer>
        {alphabetsDB.alphabets && alphabetsDB.alphabets.length <= 0 ? (
          <CircularProgress />
        ) : (
          alphabetsDB.alphabets.map((alphabetObj) => (
            //  {showFavorites   && favoriteLetters.favoriteLetters.includes(
            //   alphabetObj.alphabet
            //   )?"its a show fav":"not a fav"}
            <Fragment>
              {!showFavorites ? (
                <MousePaintPreviewItem key={lang + alphabetObj.alphabet}>
                  <Grid
                    container
                    spacing={0}
                    justify="center"
                    alignItems="center"
                  >
                    <Grid
                      key={lang + alphabetObj.alphabet + "letter"}
                      item
                      xs={5}
                      className="bookborder-left"
                    >
                      <div className="leftpage">
                        <span
                          className="letter-head"
                          onClick={() =>
                            routeChange(lang, alphabetObj.alphabet)
                          }
                        >
                          {alphabetObj.alphabet}
                        </span>
                        <Typography>Type: {alphabetObj.type} </Typography>
                        <Typography>Language: {langDB.displayName}</Typography>
                        <Typography>
                          Sound:
                          <Voice
                            pronunciationAudioSrc={
                              alphabetObj.pronunciationAudioSrc
                            }
                          />
                        </Typography>
                        <Typography>
                          Usage: <Usage content={alphabetObj.usage} />
                        </Typography>
                      </div>
                    </Grid>
                    <Grid
                      key={lang + alphabetObj.alphabet + "canvas"}
                      className="bookborder-right"
                      xs={5}
                    >
                      <MousePaintPreview
                        lang={lang}
                        letter={alphabetObj.alphabet}
                      />
                    </Grid>
                  </Grid>
                </MousePaintPreviewItem>
              ) : (
                favoriteLetters.favoriteLetters.includes(
                  alphabetObj.alphabet
                ) && (
                  <MousePaintPreviewItem key={lang + alphabetObj.alphabet}>
                    <Grid
                      container
                      spacing={0}
                      justify="center"
                      alignItems="center"
                    >
                      <Grid
                        key={lang + alphabetObj.alphabet + "letter"}
                        item
                        xs={5}
                        className="bookborder-left"
                      >
                        <div className="leftpage">
                          <span
                            className="letter-head"
                            onClick={() =>
                              routeChange(lang, alphabetObj.alphabet)
                            }
                          >
                            {alphabetObj.alphabet}
                          </span>
                          <Typography>Type: {alphabetObj.type} </Typography>
                          <Typography>
                            Language: {langDB.displayName}
                          </Typography>
                          <Typography>
                            Sound:
                            <Voice
                              pronunciationAudioSrc={
                                alphabetObj.pronunciationAudioSrc
                              }
                            />
                          </Typography>
                          <Typography>
                            Usage: <Usage content={alphabetObj.usage} />
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        key={lang + alphabetObj.alphabet + "canvas"}
                        className="bookborder-right"
                        xs={5}
                      >
                        <MousePaintPreview
                          lang={lang}
                          letter={alphabetObj.alphabet}
                        />
                      </Grid>
                    </Grid>
                  </MousePaintPreviewItem>
                )
              )}
            </Fragment>
          ))
        )}
      </MousePaintPreviewContainer>
    </div>
  );
}
const WhiteBackGroundTypography = withStyles({
  root: {
    background:
      "linear-gradient(-90deg, rgba(255,255,255,0) 0, rgba(255,255,255,1) 100%)"
  }
})(Typography);
const MousePaintPreviewContainer = styled.div`
  /* display: flex; */
  align-content: center;
  margin: 20px auto;
`;

const FilterContainer = styled.div`
  /* margin-bottom: -40px; */
  /* align-items: right; */
  float: right;
`;
const MousePaintPreviewItem = styled.div`
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 2px 2px 2px grey;
  /* border: 2px solid #aea7a1; */
  flex-direction: column;
  margin: 20px auto;
  color: black;
  font-size: 120%;
  padding: 20px;
`;
