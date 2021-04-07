import { signInWithGoogle } from "../firebase";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const Signin = () => {
  return (
    <Container>
      <SignIn>
        Come on in! Join and show how good you can write!!
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
  background: transparent;
  border-radius: 3px;
  border: 2px solid lightblue;
  box-shadow: 4px 2px 20px 5px lightblue;
  margin: 50px;
  display: flex;
  justify-content: center;
  color: green;
`;

const SignIn = styled.div`
  color: green;
  margin: 50px;
  padding: 0.25em 1em;
`;
