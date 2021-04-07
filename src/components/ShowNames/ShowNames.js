import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import LetterPreview from "./LetterPreview";
import styled from "styled-components";

export default function ShowNames({
  match: {
    params: { lang }
  }
}) {
  const userObj = useContext(UserContext);

  const [name, setName] = useState(userObj.displayName);

  return (
    <div>
      <TextAreaItem
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="text..."
      ></TextAreaItem>
      <CanvasItemContainer>
        {name.split("").map((a, i) => (
          // <LetterPreview key={a + i} letter={a} lang={lang} />
          <span key={a + i}>{a} </span>
        ))}
      </CanvasItemContainer>
    </div>
  );
}

const CanvasItemContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const TextAreaItem = styled.textarea`
  height: 50px;
  width: 500px;
  color: grey;
`;
