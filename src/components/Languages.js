import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";
import { Container, Typography } from "@material-ui/core";
import CustomizedAccordions from "./HomeLanugages/CustomizedAccordions";

export default function Languages(props) {
  const languageprop = props.languageprop;
  const [langDB, setLangDB] = useState([]);
  useEffect(() => {
    db.collection("languages").onSnapshot((snapshot) => {
      let lng = [];
      lng = snapshot.docs.map((doc) => doc.data()).map((e) => e);
      console.log(lng);
      setLangDB(lng);
    });
  }, []);

  return (
    <Container>
      {!languageprop ? (
        <Fragment>
          <CustomizedAccordions languages={langDB} />
        </Fragment>
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
