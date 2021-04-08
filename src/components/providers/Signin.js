import { signInWithGoogle } from "../firebase";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { HeaderLogo } from "../Header/HeaderLogo";
import { SiteDetails } from "../Home";
import { Typography } from "@material-ui/core";

const Signin = () => {
  return (
    <Container>
      <HeaderLogo />
      <SiteDetails />
      <SignIn>
        <Typography>
          Come on in! Join and show how good you can write!!
        </Typography>

        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={signInWithGoogle}
        >
          Sign In with Google
        </Button>
      </SignIn>
    </Container>
  );
};

export default Signin;

const Container = styled.div`
  /* trbl */
  margin: 0 250px 10px 250px;
  @media (max-width: 1000px) {
    flex-direction: column;
    margin: 0 50px 10px 50px;
  }
  /* display: inline-flex; */
`;
const SignIn = styled.div`
  color: green;
  margin: 50px;
  padding: 0.25em 1em;
`;
