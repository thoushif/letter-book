import { Typography } from "@material-ui/core";
import styled from "styled-components";

// Home Page
export const HeaderLogo = () => (
  <Title>
    <Typography variant="h3">letterbook</Typography>
  </Title>
);

const Title = styled.div`
  /* background: linear-gradient(lightblue, #dfdcda); */
  /* height: 50px; */
  color: white;
  text-shadow: 2px 2px black;
  /* font-size: 220%; */
  /* display: flex; */
`;
