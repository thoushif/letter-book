import { Chip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
export const ShowAlphabetsHeader = ({ alphabets, lang }) => {
  const history = useHistory();
  const routeChange = (lang, alphabet) => {
    let path = `/draw/${lang}/${alphabet}`;
    history.push(path);
  };
  return (
    <AlphabetItemContainer>
      {/* {alphabetsObjs.length} */}
      {alphabets &&
        alphabets.map((alphabetsObj) => (
          // <AlphabetItem key={alphabet}>
          <Chip
            key={alphabetsObj.alphabet}
            color="primary"
            label={alphabetsObj.alphabet.toUpperCase()}
            // size="small"
            // deleteIcon={<ClearIcon />}
            onClick={() => routeChange(lang, alphabetsObj.alphabet)}
            // onDelete={() => deletethisAlphabet(lang, alphabet)}
            // avatar={<Avatar>{alphabet.toUpperCase()}</Avatar>}
          />
          // </AlphabetItem>
        ))}
      {/* <AlphabetItem key={lang}>
        <Link className="seeyourname" to={`/see-your-name/${lang}`}>
          See your Name
        </Link>
      </AlphabetItem> */}
    </AlphabetItemContainer>
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
  :hover {
    background-color: grey;
    cursor: pointer;
  }
  .seeyourname {
    padding: 2px;
    color: green;
    cursor: pointer;
    text-decoration: none;
  }
`;
