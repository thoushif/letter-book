import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";
import { Container, Grid, Typography } from "@material-ui/core";

export default function Languages(props) {
  const languageprop = props.languageprop;
  const [langDB, setLangDB] = useState([]);
  useEffect(() => {
    db.collection("languages").onSnapshot((snapshot) => {
      let lng = [];
      lng = snapshot.docs.map((doc) => doc.data()).map((e) => e.name);
      console.log(lng);
      setLangDB(lng);
    });
  }, []);

  return (
    <Container>
      {!languageprop ? (
        langDB.map((lang) => (
          <Fragment key={lang}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={5}
            >
              <Grid item>
                <Link className="language" to={`/draw/${lang}`}>
                  <Typography>{lang.toUpperCase()}</Typography>
                </Link>
              </Grid>
            </Grid>
          </Fragment>
        ))
      ) : (
        <LanguageItem key={languageprop}>
          <Link className="language" to={`/draw/${languageprop}`}>
            {languageprop.toUpperCase()} {props.children}
          </Link>
        </LanguageItem>
      )}
    </Container>
  );
}

const LanguageItem = styled.div``;
const LanguageItemContainer = styled.div``;
