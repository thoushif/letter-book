import { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { db } from "../firebase";
import firebase from "firebase/app";
import ThumbUpAltTwoToneIcon from "@material-ui/icons/ThumbUpAltTwoTone";
import ThumbDownAltTwoToneIcon from "@material-ui/icons/ThumbDownAltTwoTone";
import {
  Button,
  ButtonGroup,
  Dialog,
  Tooltip,
  Typography
} from "@material-ui/core";
import { Voters } from "./Voters";

export default function VoteButtons({ letter, userId, self }) {
  const user = useContext(UserContext);
  const [likeCount, setLikeCount] = useState();
  const [dislikeCount, setDislikeCount] = useState();
  const [upvoteDisabled, setUpvoteDisabled] = useState(false);
  const [downvoteDisabled, setDownvoteDisabled] = useState(false);
  const [likeDone, setLikeDone] = useState(false);
  const [dislikeDone, setDislikeDone] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const votesByPplInitState = { likedppl: [], dislikedPpl: [] };
  const [votesByPpl, setVotesByPpl] = useState(votesByPplInitState);
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
        // console.log(votedByObj);
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
    setVotesByPpl(votesByPplInitState);
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
      }, votedByObj);

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
        // console.log(votedByObj);
        resetVoteButtonsUtil(doc.data().letter, votedByObj);
      }
    });
  };
  const handleClickOpenVotePreview = () => {
    showWhoVoted();
    setOpenPreview(true);
  };
  const handleCloseVotePreview = () => {
    setVotesByPpl(votesByPplInitState);
    setOpenPreview(false);
  };
  const showWhoVoted = async () => {
    console.log("showing who liked or disliked for", letter, userId);
    let votedByObj;
    await db
      .collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userId)
      .get()
      .then(function (doc) {
        setLikeCount(doc.data().likeCount);
        setDislikeCount(doc.data().dislikeCount);
        votedByObj = doc.data().votedBy ? doc.data().votedBy : undefined;
        /*let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice']

        let countedNames = names.reduce(function (allNames, name) {
          if (name in allNames) {
            allNames[name]++
          }
          else {
            allNames[name] = 1
          }
          return allNames
        }, {})*/
      });
    function groupBy(objectArray, property) {
      return objectArray.reduce(function (acc, obj) {
        let key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});
    }
    let likedppl = [];
    let disLikedppl = [];
    if (votedByObj) {
      // votedByObj.forEach((vote) => {
      //   console.log(vote);
      // });
      let upVoteAddcount,
        downVoteAddcount,
        upVoteRemovecount,
        downVoteRemovecount;
      let groupedVotedPeople = groupBy(votedByObj, "voteUser");
      console.log(groupedVotedPeople);
      Object.keys(groupedVotedPeople).forEach((e) => {
        console.log(e);
        console.log(groupedVotedPeople[e]);

        upVoteAddcount = groupedVotedPeople[e].filter((eachVote) => {
          return eachVote.action === "add" && eachVote.voteUp;
        }).length;
        downVoteAddcount = groupedVotedPeople[e].filter((eachVote) => {
          return eachVote.action === "add" && !eachVote.voteUp;
        }).length;
        upVoteRemovecount = groupedVotedPeople[e].filter((eachVote) => {
          return eachVote.action === "remove" && eachVote.voteUp;
        }).length;
        downVoteRemovecount = groupedVotedPeople[e].filter((eachVote) => {
          return eachVote.action === "remove" && !eachVote.voteUp;
        }).length;
        if (upVoteAddcount > upVoteRemovecount) {
          console.log(e, " finally upvoted");
          likedppl.push(e);
        }
        if (downVoteAddcount > downVoteRemovecount) {
          console.log(e, " finally downvoted");
          disLikedppl.push(e);
        }
      });
      console.log("liked ppl", likedppl);
      console.log("disliked ppl", disLikedppl);
      //{ likedppl: [], dislikedPpl: [] }
      let votePplState = { likedppl: likedppl, dislikedPpl: disLikedppl };

      setVotesByPpl(votePplState);
      // groupedVotedPeople.forEach((votePpl) => {
      //   console.log(votePpl.value);
      // });
    }
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
      {!self && (
        <ButtonGroup variant="text">
          <Button disabled={upvoteDisabled} onClick={() => vote(true)}>
            <Tooltip title="like">
              <ThumbUpAltTwoToneIcon
                color={likeDone ? "primary" : ""}
                fontSize="small"
                // color={!likeDone ? "primary" : "secondary"}
              />
            </Tooltip>
          </Button>

          {/* <Typography variant="caption">Likes</Typography> */}
          <Button disabled={downvoteDisabled} onClick={() => vote(false)}>
            <Tooltip title="Dislike">
              <ThumbDownAltTwoToneIcon
                fontSize="small"
                color={dislikeDone ? "primary" : ""}
              />
            </Tooltip>
          </Button>
        </ButtonGroup>
      )}
      <Button
        color="primary"
        variant={self ? "contained" : "outlined"}
        disabled={likeCount === 0 && dislikeCount === 0}
        size="small"
        onClick={() => handleClickOpenVotePreview()}
      >
        <Typography>
          {likeCount ? likeCount : 0} likes {dislikeCount ? dislikeCount : 0}{" "}
          dislikes{" "}
        </Typography>
      </Button>
      <Dialog open={openPreview} onClose={() => handleCloseVotePreview()}>
        {votesByPpl.likedppl && votesByPpl.dislikedPpl && (
          <Voters votedPpl={votesByPpl} />
        )}
      </Dialog>
    </div>
  );
}
