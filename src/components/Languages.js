import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";
import { Container, Tooltip, Typography } from "@material-ui/core";
import CustomizedAccordions from "./HomeLanugages/CustomizedAccordions";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";

export default function Languages(props) {
  const languageprop = props.languageprop;
  const [langDB, setLangDB] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState(false);

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
          <Tooltip title="filter by favorite">
            {filterLanguages ? (
              <StarOutlinedIcon
                onClick={() => setFilterLanguages(!filterLanguages)}
              ></StarOutlinedIcon>
            ) : (
              <StarOutlineOutlinedIcon
                onClick={() => setFilterLanguages(!filterLanguages)}
              ></StarOutlineOutlinedIcon>
            )}
          </Tooltip>
          {filterLanguages && "Filtered Favorite languages"}
          <CustomizedAccordions
            languages={langDB}
            filterLanguages={filterLanguages}
          />
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
