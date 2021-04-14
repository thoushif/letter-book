import {
  AppBar,
  Avatar,
  Box,
  Grid,
  Tab,
  Tabs,
  Typography
} from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { UserContext } from "../providers/UserProvider";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export const Voters = ({ votedPpl }) => {
  const dislikersInitState = { dislikers: [] };
  const [dislikers, setDislikers] = useState(dislikersInitState);
  const likersInitState = { likers: [] };
  const [likers, setLikers] = useState(likersInitState);
  const [value, setValue] = useState(0);
  const user = useContext(UserContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    votedPpl.dislikedPpl &&
      votedPpl.dislikedPpl.forEach((vote) => {
        db.collection("users")
          .doc(vote)
          .get()
          .then((user) => {
            // setDislikers((dislikers) => [...dislikers, user.data()]);
            setDislikers((dislikers) => ({
              dislikers: [...dislikers.dislikers, user.data()]
            }));
          });
      });
    votedPpl.likedppl &&
      votedPpl.likedppl.forEach((vote) => {
        db.collection("users")
          .doc(vote)
          .get()
          .then((user) => {
            setLikers((likers) => ({
              likers: [...likers.likers, user.data()]
            }));
          });
      });
    return cleanup;
  }, [votedPpl]);
  const cleanup = () => {
    setDislikers(dislikersInitState);
    setLikers(likersInitState);
  };
  return (
    <div>
      {/* showing disliked ppl
      {votedPpl && votedPpl.dislikedPpl.map((vote) => <div>{vote}</div>)} */}

      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Likes"></Tab>
          <Tab label="Dislikes" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {likers &&
          likers.likers &&
          likers.likers.map((liker) => (
            <Grid
              key={liker.userId}
              container
              direction="row"
              spacing={3}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Avatar alt={liker.userId} src={liker.photoURL} />
              </Grid>
              <Grid item>{liker.userName}</Grid>
              {user.uid === liker.userId && "(You)"}
            </Grid>

            // <div
            //   style={{
            //     display: "flex",
            //     alignItems: "center",
            //     flexWrap: "wrap"
            //   }}
            // >
            //   {/* <img src={liker.photoURL} width="25%" alt="liker" /> */}

            // </div>
          ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {dislikers &&
          dislikers.dislikers &&
          dislikers.dislikers.map((disliker) => (
            <Grid
              key={disliker.userId}
              container
              direction="row"
              spacing={3}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <Avatar alt={disliker.userId} src={disliker.photoURL} />
              </Grid>
              <Grid item> {disliker.userName}</Grid>
              {user.uid === disliker.userId && "(You)"}
            </Grid>
          ))}
      </TabPanel>
    </div>
  );
};
