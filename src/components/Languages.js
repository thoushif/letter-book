import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "./firebase";
import styled from "styled-components";
import { Container, Tooltip, Typography, withStyles } from "@material-ui/core";
import CustomizedAccordions from "./HomeLanugages/CustomizedAccordions";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";

export default function Languages(props) {
  const languageprop = props.languageprop;
  const [langDB, setLangDB] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState(false);

  useEffect(() => {
    db.collection("languages")
      .get()
      .then((snapshot) => {
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
          <FilterListRoundedIcon />
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

          <Typography variant="caption">
            {" "}
            {filterLanguages && "Filtered Favorite languages"}
          </Typography>
          <CustomizedAccordions
            languages={langDB}
            filterLanguages={filterLanguages}
          />
        </Fragment>
      ) : (
        <LanguageItem key={languageprop}>
          <Link className="language" to={`/draw/${languageprop}`}>
            <WhiteTextTypography variant="h6">
              {props.children}
            </WhiteTextTypography>
          </Link>
        </LanguageItem>
      )}
    </Container>
  );
}

const LanguageItem = styled.div``;
export const WhiteTextTypography = withStyles({
  root: {
    color: "black",
    textShadow: "0px 0px 15px  #FFFFFF",
    fontSize: "1.5em"
  }
})(Typography);
// Draw Page
