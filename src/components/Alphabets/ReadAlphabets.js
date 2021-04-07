import "../../styles.css";
import { useContext, useEffect, useState } from "react";
import langData from "../../data/languagedata.json";
import { ShowAlphabets } from "./ShowAlphabets";
import { Voice } from "./Voice";
import styled from "styled-components";
import MousePaintPreview from "../MousePaintPreview";
import { db } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import { Button, Grid, Typography } from "@material-ui/core";
import { Usage } from "./Usage";

export default function ReadAlphabets({
  match: {
    params: { lang }
  }
}) {
  const [alphabets, setAlphabets] = useState();
  const [showOnlyDrawn, setShowOnlyDrawn] = useState(false);
  const [alphabetsFiltered, setAlphabetsFiltered] = useState("");
  const userObj = useContext(UserContext);

  const canvasDBObj = db.collection("letters-written");
  // .where("userId", "==", userObj.uid);
  useEffect(() => {
    if (showOnlyDrawn) {
      console.log("showOnlyDrawn, true");
      canvasDBObj.get().then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("letterssssss", alphabetsFiltered);

          if (
            doc.data().userId === userObj.uid &&
            doc.data().language === lang
          ) {
            setAlphabetsFiltered((alphabetsFiltered) => {
              return alphabetsFiltered + "," + doc.data().letter;
            });
          }
        });
      });
      console.log("serttingb letterssssss", alphabetsFiltered);
      setAlphabets(alphabetsFiltered.substring(1));
    } else {
      console.log("showOnlyDrawn, false");
      let langDataFiltered = langData.find(
        (langEach) => langEach.language.toLowerCase() === lang.toLowerCase()
      );
      langDataFiltered
        ? setAlphabets(langDataFiltered.alphabets)
        : setAlphabets();
    }
    return cleanUp;
  }, [lang, showOnlyDrawn]);
  const cleanUp = () => {
    setAlphabets();
    setAlphabetsFiltered("");
  };
  return (
    <div>
      <Typography>
        Language : {lang.toUpperCase()}
        {/* <p>Alphabets Filtered : {alphabetsFiltered.substring(1)}</p> */}
      </Typography>
      <Typography>
        Alphabets :{" "}
        {showOnlyDrawn ? "Showing only drawn by you" : "Showing all"}
      </Typography>
      <ShowAlphabets
        alphabets={showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets}
        lang={lang}
      />
      <Button
        className="show-only-drawn"
        size="small"
        onClick={() => {
          setShowOnlyDrawn(!showOnlyDrawn);
        }}
      >
        {showOnlyDrawn ? "Show all " : "Show only drawn by me"}
      </Button>
      {/* todo: this will be the social feed  NOT for all alphabets*/}
      <MousePaintPreviewContainer>
        {(showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets) &&
          (showOnlyDrawn ? alphabetsFiltered.substring(1) : alphabets)
            .split(",")
            .map((a) => (
              <MousePaintPreviewItem key={lang + a}>
                <Grid
                  container
                  spacing={0}
                  justify="space-evenly"
                  alignItems="center"
                >
                  <Grid
                    alignItems="center"
                    key={lang + a + "letter"}
                    item
                    xs="5"
                  >
                    <div>
                      <span className="letter-head">{a}</span>
                      <Typography>Type: </Typography>
                      <Typography>Language: {lang}</Typography>
                      <Typography>
                        Sound: <Voice letter={a} lang={lang} />
                      </Typography>
                      <Typography>
                        Usage: <Usage letter={a} lang={lang} />
                      </Typography>
                    </div>
                  </Grid>
                  <Grid key={lang + a + "canvas"} item xs="5">
                    <MousePaintPreview lang={lang} letter={a} />
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
`;

const FilterContainer = styled.div`
  /* display: flex; */
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
