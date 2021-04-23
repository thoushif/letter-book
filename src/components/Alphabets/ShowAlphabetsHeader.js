import { Chip } from "@material-ui/core";
import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
export const ShowAlphabetsHeader = ({
  alphabets,
  lang,
  lines,
  favoriteLetters
}) => {
  const history = useHistory();
  const routeChange = (lang, alphabet) => {
    let path = `/draw/${lang}/${alphabet}`;
    history.push(path);
  };
  return (
    <Fragment>
      {/* {favoriteLetters.favoriteLetters} */}
      {lines ? (
        [...Array(lines)].map((e, i) => (
          <AlphabetItemContainer key={i}>
            {/* {alphabet.line + "at "+ i + 1 + "th time"} */}
            {alphabets &&
              alphabets
                .filter((alphabet) => alphabet.line === i + 1)
                .filter((alphabet) => {
                  if (favoriteLetters.favoriteLetters.length <= 0) return true;
                  else {
                    return favoriteLetters.favoriteLetters.includes(
                      alphabet.alphabet
                    );
                  }
                })
                .map((alphabetsObj) => (
                  // <AlphabetItem key={alphabet}>

                  <Chip
                    key={alphabetsObj.alphabet + i}
                    color="primary"
                    label={alphabetsObj.alphabet.toUpperCase()}
                    size="medium"
                    // deleteIcon={<ClearIcon />}
                    onClick={() => routeChange(lang, alphabetsObj.alphabet)}
                    // onDelete={() => deletethisAlphabet(lang, alphabet)}
                    // avatar={<Avatar>{alphabet.toUpperCase()}</Avatar>}
                  />
                ))}
          </AlphabetItemContainer>
        ))
      ) : (
        <AlphabetItemContainer>
          {alphabets &&
            alphabets
              .filter((alphabet) => alphabet.line === 1)
              .map((alphabetsObj) => (
                <Chip
                  key={alphabetsObj.alphabet}
                  color="primary"
                  label={alphabetsObj.alphabet.toUpperCase()}
                  size="medium"
                  // deleteIcon={<ClearIcon />}
                  onClick={() => routeChange(lang, alphabetsObj.alphabet)}
                  // onDelete={() => deletethisAlphabet(lang, alphabet)}
                  // avatar={<Avatar>{alphabet.toUpperCase()}</Avatar>}
                />
              ))}
        </AlphabetItemContainer>
      )}
    </Fragment>
  );
};

const AlphabetItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
`;
const AlphabetItem = styled.div`
  max-width: 500px;
  background-color: white;
  border-radius: 5px;
  border-color: black;
  border: 2px solid black;
  flex-direction: row;
  margin-right: 10px;
  margin-bottom: 10px;

  color: black;
  font-size: 120%;
  padding: 2px;

  .seeyourname {
    padding: 2px;
    color: green;
    cursor: pointer;
    text-decoration: none;
  }
`;
