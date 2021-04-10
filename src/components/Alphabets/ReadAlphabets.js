import "../../styles.css";
import { useContext, useEffect, useState } from "react";
import { ShowAlphabetsHeader } from "./ShowAlphabetsHeader";
import { Voice } from "./Voice";
import styled from "styled-components";
import MousePaintPreview from "../MousePaintPreview";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { Usage } from "./Usage";

export default function ReadAlphabets({
  match: {
    params: { lang }
  }
}) {
  const [showOnlyDrawn, setShowOnlyDrawn] = useState("");
  // const userObj = useContext(UserContext);
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
          types: doc.data().types
        };
        setLangDB(langDBObj);
      });
    });
  };
  // const history = useHistory();
  // const routeChange = (lang, alphabet) => {
  //   let path = `/draw/${lang}/${alphabet}`;
  //   history.push(path);
  // };
  const alphabetInitState = { alphabets: [] };
  const [alphabetsDB, setAlphabetsDB] = useState(alphabetInitState);
  const alphabetsObj = db.collection("languages").where("name", "==", lang);
  const alphabetsLangObj = db.collection("languages");
  const readAlphabetFromDB = (type) => {
    let result = alphabetsObj.get();
    result.then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        const letters = type
          ? alphabetsLangObj
              .doc(doc.id)
              .collection("letters")
              .orderBy("index", "asc")
              .where("type", "==", type)
              .get()
          : alphabetsLangObj
              .doc(doc.id)
              .collection("letters")
              .orderBy("index", "asc")
              .get();
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
  }, [lang, showOnlyDrawn]);
  const cleanUp = () => {
    setAlphabetsDB(alphabetInitState);
  };
  return (
    <div>
      <Typography>
        Language : {langDB.displayName}
        {/* <p>Alphabets Filtered : {alphabetsFiltered.substring(1)}</p> */}
      </Typography>
      <Typography>
        Alphabets :{" "}
        {showOnlyDrawn ? "Showing " + showOnlyDrawn + "s" : "Showing all"}
      </Typography>
      {alphabetsDB.alphabets && (
        <ShowAlphabetsHeader alphabets={alphabetsDB.alphabets} lang={lang} />
      )}
      <FilterContainer>
        {langDB.types &&
          langDB.types.map((type) => (
            <Button
              key={type}
              className="show-only-drawn"
              size="small"
              onClick={() => {
                setShowOnlyDrawn(type);
              }}
            >
              {type}S
            </Button>
          ))}

        <Button
          className="show-only-drawn"
          size="small"
          onClick={() => {
            setShowOnlyDrawn("");
          }}
        >
          ALL
        </Button>
      </FilterContainer>
      {/* todo: this will be the social feed  NOT for all alphabets*/}
      <MousePaintPreviewContainer>
        {alphabetsDB.alphabets &&
          alphabetsDB.alphabets.map((alphabetObj) => (
            <MousePaintPreviewItem key={lang + alphabetObj.alphabet}>
              <Grid
                container
                spacing={0}
                justify="space-evenly"
                // alignItems="center"
              >
                <Grid
                  alignItems="center"
                  key={lang + alphabetObj.alphabet + "letter"}
                  item
                  xs={5}
                >
                  <div>
                    <span
                      className="letter-head"
                      // onClick={() => routeChange(lang, alphabetsObj.type)}
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
                <Grid key={lang + alphabetObj.alphabet + "canvas"} item xs={5}>
                  <MousePaintPreview
                    lang={lang}
                    letter={alphabetObj.alphabet}
                  />
                </Grid>
              </Grid>
            </MousePaintPreviewItem>
          ))}
      </MousePaintPreviewContainer>
    </div>
  );
}

const MousePaintPreviewContainer = styled.div`
  /* display: flex; */
  align-content: center;
  margin: 20px auto;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
  float: right;
`;
const MousePaintPreviewItem = styled.div`
  background-color: white;
  border-radius: 5px;
  border-color: black;
  border: 2px solid #aea7a1;
  flex-direction: column;
  margin: 20px auto;
  color: black;
  font-size: 120%;
  padding: 20px;
  :hover {
    background-color: #ebf7ee;
  }
`;
