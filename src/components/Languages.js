import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";
import { Container, Grid, Typography } from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
export default function Languages(props) {
  const languageprop = props.languageprop;
  const [langDB, setLangDB] = useState([]);
  useEffect(() => {
    db.collection("languages").onSnapshot((snapshot) => {
      let lng = [];
      lng = snapshot.docs.map((doc) => doc.data()).map((e) => e);
      // console.log(lng);
      setLangDB(lng);
    });
  }, []);

  return (
    <Container>
      {!languageprop ? (
        langDB.map((lang, i) => (
          <Fragment key={lang.name}>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={5}
            >
              <Grid item>
                <Link className="language" to={`/draw/${lang.name}`}>
                  <Typography>
                    <ListIcon fontSize="small" />{" "}
                    {lang.displayName
                      ? lang.displayName
                      : lang.name.toUpperCase()}
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Fragment>
        ))
      ) : (
        <LanguageItem key={languageprop}>
          <Link className="language" to={`/draw/${languageprop}`}>
            <Typography variant="h5">{props.children}</Typography>
          </Link>
        </LanguageItem>
      )}
    </Container>
  );
}

const LanguageItem = styled.div``;
