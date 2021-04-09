import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { db } from "../firebase";
import firebase from "firebase/app";
import ThumbUpAltTwoToneIcon from "@material-ui/icons/ThumbUpAltTwoTone";
import ThumbDownAltTwoToneIcon from "@material-ui/icons/ThumbDownAltTwoTone";
import { Button, Tooltip, Typography } from "@material-ui/core";

export default function VoteButtons({ letter, userId }) {
  const user = useContext(UserContext);
  const [likeCount, setLikeCount] = useState();
  const [dislikeCount, setDislikeCount] = useState();
  const [upvoteDisabled, setUpvoteDisabled] = useState(false);
  const [downvoteDisabled, setDownvoteDisabled] = useState(false);
  const [likeDone, setLikeDone] = useState(false);
  const [dislikeDone, setDislikeDone] = useState(false);
  const canvasDBObj = db
    .collection("canvasObjects")
    .doc(letter)
    .collection("users")
    .doc(userId);
  useEffect(() => {
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userId)
      .onSnapshot(function (doc) {
        setLikeCount(doc.data().likeCount);
        setDislikeCount(doc.data().dislikeCount);
        let votedByObj = doc.data().votedBy ? doc.data().votedBy : undefined;
        console.log(votedByObj);
        resetVoteButtonsUtil(letter, votedByObj);
      });

    return cleanup();
  }, [letter, userId]);
  const cleanup = () => {
    setLikeCount(0);
    setDislikeCount(0);
    setUpvoteDisabled(false);
    setDownvoteDisabled(false);
    setLikeDone(false);
    setDislikeDone(false);
  };
  const resetVoteButtonsUtil = (letter, votedByObj) => {
    setUpvoteDisabled(false);
    setDownvoteDisabled(false);
    let maxvotedByObj =
      votedByObj &&
      votedByObj.reduce(function (prev, current) {
        return prev.voteUser === user.uid &&
          current.voteUser === user.uid &&
          prev.votedAt > current.votedAt
          ? prev
          : current;
      });

    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          item.voteUp &&
          item.action === "add" &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setUpvoteDisabled(false);
      setDownvoteDisabled(true);
      setLikeDone(true);
      setDislikeDone(false);
    }
    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          item.voteUp &&
          item.action === "remove" &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setUpvoteDisabled(false);
      setDownvoteDisabled(false);
      setLikeDone(false);
      setDislikeDone(false);
    }
    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          !item.voteUp &&
          item.action === "add" &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setUpvoteDisabled(true);
      setDownvoteDisabled(false);
      setLikeDone(false);
      setDislikeDone(true);
    }
    if (
      votedByObj &&
      votedByObj.some(
        (item) =>
          item.voteUser === user.uid &&
          !item.voteUp &&
          item.action === "remove" &&
          maxvotedByObj.votedAt === item.votedAt
      )
    ) {
      setUpvoteDisabled(false);
      setDownvoteDisabled(false);
      setLikeDone(false);
      setDislikeDone(false);
    }
    // if (!likeDone && !dislikeDone) {
    //   setUpvoteDisabled(false);
    //   setDownvoteDisabled(false);
    // }
  };
  const resetVoteButtons = () => {
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        let votedByObj = doc.data().votedBy ? doc.data().votedBy : undefined;
        console.log(votedByObj);
        resetVoteButtonsUtil(doc.data().letter, votedByObj);
      }
    });
  };
  const vote = (voteUp) => {
    // like-> deactivate dislike
    //  un like -> activate both
    // like -> deactivate dislike

    // dislike-> deactivate like
    //  un dislike -> activate both
    // dislike -> deactivate like

    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        let canvas = doc.data();
        let timeNow = firebase.firestore.Timestamp.now();
        let likeCount = canvas.likeCount ? canvas.likeCount : 0;
        let dislikeCount = canvas.dislikeCount ? canvas.dislikeCount : 0;

        let likeSign = 1;
        let disLikeSign = 1;
        let action = "add";
        if (likeDone) {
          likeSign = -1;
          action = "remove";
        }
        if (dislikeDone) {
          disLikeSign = -1;
          action = "remove";
        }

        let votedByNow = {
          voteUser: user.uid,
          votedAt: timeNow,
          voteUp: voteUp,
          action: action
        };
        if (voteUp) {
          canvasDBObj.update({
            votedBy: firebase.firestore.FieldValue.arrayUnion(votedByNow),
            likeCount: likeCount + 1 * likeSign
          });
          setLikeDone((likeDone) => !likeDone);
        } else {
          canvasDBObj.update({
            votedBy: firebase.firestore.FieldValue.arrayUnion(votedByNow),
            dislikeCount: dislikeCount + 1 * disLikeSign
          });
          setDislikeDone((dislikeDone) => !dislikeDone);
        }
      }
    });
    resetVoteButtons();
  };
  return (
    <div>
      {/* {likeDone ? "you liked" : "not yet liked"}
      {dislikeDone ? "you disliked" : "not yet disliked"} */}
      <Button disabled={upvoteDisabled} onClick={() => vote(true)}>
        {likeCount ? likeCount : 0}
        <Tooltip title="like">
          <ThumbUpAltTwoToneIcon
            // style={{ cursor: upvoteDisabled ? "not-allowed" : "pointer" }}
            fontSize="small"
            // color={!likeDone ? "primary" : "secondary"}
          />
        </Tooltip>
      </Button>
      {/* <Typography variant="caption">Likes</Typography> */}
      <Button disabled={downvoteDisabled} onClick={() => vote(false)}>
        {dislikeCount ? dislikeCount : 0}
        <Tooltip title="Dislike">
          <ThumbDownAltTwoToneIcon fontSize="small" />
        </Tooltip>
      </Button>
      <Typography variant="caption"></Typography>
    </div>
  );
}
