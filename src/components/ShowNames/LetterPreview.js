import MousePaintPreview from "../MousePaintPreview";
import styled from "styled-components";
import Languages from "../Languages";
import { Button, Grid, Typography } from "@material-ui/core";
import { Voice } from "../Alphabets/Voice";
import { Usage } from "../Alphabets/Usage";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function LetterPreview({
  match: {
    params: { lang, letter }
  }
}) {
  const alphabetsLangObj = db.collection("languages");
  const alphabetsObj = db.collection("languages").where("name", "==", lang);

  const [alphabetsDB, setAlphabetsDB] = useState({});

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
              type: letter.data().type,
              alphabet: letter.data().alphabet
            };
            setAlphabetsDB(letterObjJson);
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

  useEffect(() => {
    readAlphabetFromDB(letter);
    readLangFromDB();
  }, [letter]);
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
        <Grid container spacing={0} justify="space-evenly" alignItems="center">
          <Grid
            alignItems="center"
            key={lang + alphabetsDB.alphabet + "letter"}
            item
            xs="5"
          >
            <div>
              <span className="letter-head">{alphabetsDB.alphabet}</span>
              <Typography>Type: {alphabetsDB.type} </Typography>
              <Typography>Language: {langDB.displayName}</Typography>
              <Typography>
                Sound: <Voice letter={alphabetsDB.alphabet} lang={lang} />
              </Typography>
              <Typography>
                Usage: <Usage content={alphabetsDB.usage} />
              </Typography>
            </div>
          </Grid>
          <Grid key={lang + alphabetsDB.alphabet + "canvas"} item xs={5}>
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
  /* background-color: white;
  border-radius: 5px;
  border: 2px solid #aea7a1;
  font-size: 120%;
  padding: 20px; */
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
