import MousePaintPreview from "../MousePaintPreview";
import styled from "styled-components";
import Languages from "../Languages";
import { Grid, Typography } from "@material-ui/core";
import { Voice } from "../Alphabets/Voice";
import { Usage } from "../Alphabets/Usage";

export default function LetterPreview({
  match: {
    params: { lang, letter }
  }
}) {
  // return <MousePaintPreview lang={lang} letter={letter} />;
  return (
    <MousePaintPreviewContainer>
      <Languages languageprop={lang}>
        <Typography>Show All letters</Typography>
      </Languages>
      <MousePaintPreviewItem>
        <Grid container spacing={0} justify="space-evenly" alignItems="center">
          {/* <Grid key={lang + letter + "letter"} item xs="1">
            <div>
              <span className="letter-head">{letter}</span>
            </div>
          </Grid> */}
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
        {/* {letter}

      <MousePaintPreviewItem key={lang + letter}>
        <MousePaintPreview lang={lang} letter={letter} />
      </MousePaintPreviewItem> */}
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
