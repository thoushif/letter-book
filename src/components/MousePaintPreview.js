import { Fragment, useContext, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import MousePaint from "./MousePaint";
import { UserContext } from "./providers/UserProvider";
import { db } from "./firebase";
import VoteButtons from "./VoteActions/VoteButtons";
import styled from "styled-components";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";
import { Button, Dialog, Tooltip, Typography } from "@material-ui/core";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import OthersLetterPreview from "./ShowNames/OthersLetterPreview";
import PostAddRoundedIcon from "@material-ui/icons/PostAddRounded";
import firebase from "firebase/app";
import date from "date-and-time";
import { useHistory } from "react-router-dom";

export default function MousePaintPreview({ lang, letter, showOthers }) {
  const userObj = useContext(UserContext);
  const history = useHistory();
  const paintCanvasInitialState = {
    letter: letter,
    lang: lang,
    showCanvas: "false",
    color: "#ffc600",
    width: 100,
    height: 100,
    brushRadius: 2,
    lazyRadius: 6,
    loadTimeOffset: 5,
    saveData: null,
    votes: 0,
    isPublished: false
  };
  const [paintCanvas, setPaintCanvas] = useState(paintCanvasInitialState);
  const [otherPaints, setOtherPaints] = useState([]);
  const [otherPaintsCount, setOtherPaintsCount] = useState(0);
  const [showCanvas, setShowCanvas] = useState("false");
  const [openPreview, setOpenPreview] = useState(false);
  const [openOthersPreview, setOpenOthersPreview] = useState(false);
  const [paintCanvasOperation, setOpenOthersPreviewOperation] = useState("");

  const [canvasPreviewState, setCanvasPreviewState] = useState(
    paintCanvasInitialState
  );
  useEffect(() => {
    // console.log("redrawing because", letter, paintCanvasOperation);
    getCanvasData(letter);
    getCanvasAllOthersData(letter);
    return cleanup;
  }, [letter, lang, showCanvas, userObj, paintCanvasOperation]);

  const cleanup = () => {
    setOtherPaints([]);
    setPaintCanvas(paintCanvasInitialState);
    setCanvasPreviewState("");
    setOtherPaintsCount(0);
    setOpenOthersPreviewOperation("");
  };
  const handleClickOpenPreview = (eachPaint, letter) => {
    setOpenPreview(true);
    setCanvasPreviewState((canvasPreviewState) => ({
      ...canvasPreviewState,
      eachPaint: eachPaint,
      letter: letter
    }));
  };

  const handleClickOpenOthersPreview = (eachPaint, letter) => {
    setOpenOthersPreview(true);
    setCanvasPreviewState((canvasPreviewState) => ({
      ...canvasPreviewState,
      eachPaint: eachPaint,
      letter: letter
    }));
  };
  const routeChange = (lang, alphabet) => {
    let path = `/draw/${lang}/${alphabet}`;
    history.push(path);
  };
  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleCloseOthersPreview = () => {
    setOpenOthersPreview(false);
  };
  const getCanvasData = (letter) => {
    let canvasDBObj;
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userObj.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          canvasDBObj = snapshot.data();
          if (canvasDBObj.isActive) {
            setPaintCanvas({
              ...paintCanvas,
              isPublished: canvasDBObj.isPublished,
              publishedAt: canvasDBObj.publishedAt,
              saveData: canvasDBObj.canvasData,
              likeCount: canvasDBObj.likeCount,
              disLikeCount: canvasDBObj.dislikeCount
            });
          }
        }
      });
    // db.collection("canvasObjects")
    //   .doc(letter + userObj.uid)
    //   .get()
    //   .then((doc) => {
    //     if (doc.exists) {
    //       canvasDBObj = doc.data();
    //       setPaintCanvas({ ...paintCanvas, saveData: canvasDBObj.canvasData });
    //     }
    //   });
  };
  const deleteCanvas = (type) => {
    let message =
      type === "posted"
        ? "Deleting resets whole drawing and zeros all likes/dislikes, continue?"
        : "Not yet Posted, Deleting resets whole drawing, continue?";
    if (window.confirm(message)) {
      const canvasDBObj = db
        .collection("canvasObjects")
        .doc(letter)
        .collection("users")
        .doc(userObj.uid);
      canvasDBObj.get().then((doc) => {
        if (doc.exists) {
          canvasDBObj.update({
            canvasData: "",
            likeCount: 0,
            dislikeCount: 0,
            isActive: false,
            deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
            votedBy: []
          });
          setOpenOthersPreviewOperation("delete");
        }
      });
    }
  };
  const publishCanvas = () => {
    const canvasDBObj = db
      .collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userObj.uid);
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        setOpenOthersPreviewOperation("publish");
        canvasDBObj.update({
          isPublished: true,
          publishedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  };
  const getCanvasAllOthersData = (letter) => {
    setOtherPaints([]);
    // console.log("working with letter ", letter);
    // const userObj = db.collection("users").doc(userId).collection("canvasObjects").doc(letter);
    let canvasDBObj;
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .get()
      .then((querySnapshot) => {
        // setOtherPaintsCount(querySnapshot.size);

        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          canvasDBObj = doc.data();
          if (
            canvasDBObj.isActive &&
            canvasDBObj.isPublished &&
            canvasDBObj.userId !== userObj.uid
          ) {
            setOtherPaints((otherPaints) => [...otherPaints, canvasDBObj]);
            setOtherPaintsCount((count) => count + 1);
          }
        });
      });
  };
  return (
    <div>
      {showCanvas === "true" && (
        <Dialog open={showCanvas} maxWidth="sm" fullWidth="true">
          <MousePaint
            paintCanvas={paintCanvas}
            setOtherPaints={setOtherPaints}
            setShowCanvas={setShowCanvas}
          />
        </Dialog>
      )}
      {paintCanvas.saveData && showCanvas === "false" && !showOthers ? (
        <Fragment>
          <Typography> Your Drawing!</Typography>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handleClickOpenPreview(paintCanvas, letter)}
          >
            <CanvasDraw
              disabled
              // imgSrc="https://cdn.pixabay.com/photo/2020/09/24/07/59/telugu-5597907_960_720.png"
              canvasWidth={paintCanvas.width + 50}
              canvasHeight={paintCanvas.height + 50}
              brushRadius={paintCanvas.brushRadius}
              lazyRadius={paintCanvas.lazyRadius}
              saveData={paintCanvas.saveData}
              gridColor={paintCanvas.isPublished ? "green" : "lightgrey"}
              loadTimeOffset={paintCanvas.loadTimeOffset}
            />
          </div>
          {/* <Button
                        onClick={() => {
                          deleteCanvas();
                        }}
                      >
                        <Tooltip title="Delete">
                          <DeleteForeverRoundedIcon color="secondary" fontSize="small" />
                        </Tooltip>
                      </Button> */}

          <Dialog open={openPreview} onClose={() => handleClosePreview()}>
            <OthersLetterPreview canvasPreviewState={paintCanvas} self="yes" />
          </Dialog>
          <Typography variant="subtitle2">
            {paintCanvas.isPublished && paintCanvas.publishedAt
              ? "Posted at " +
                date.format(
                  new Date(paintCanvas.publishedAt.seconds * 1000),
                  "ddd, MMM DD YYYY HH:mm"
                )
              : "Draft"}
            {showCanvas === "false" && !paintCanvas.isPublished && (
              <Fragment>
                <Button
                  className="flasher"
                  onClick={() => {
                    publishCanvas();
                  }}
                >
                  <Tooltip title="publish / post">
                    <PostAddRoundedIcon color="primary" />
                  </Tooltip>
                </Button>
                <Button
                  onClick={() => {
                    deleteCanvas("draft");
                  }}
                >
                  <Tooltip title="Delete">
                    <DeleteForeverRoundedIcon
                      color="secondary"
                      fontSize="small"
                    />
                  </Tooltip>
                </Button>
                <Button
                  onClick={() => {
                    setShowCanvas("true");
                  }}
                >
                  <Tooltip title="Edit">
                    <EditRoundedIcon fontSize="small" />
                  </Tooltip>
                </Button>
              </Fragment>
            )}
          </Typography>
          {paintCanvas.isPublished && (
            <Typography variant="subtitle2">
              <Button
                onClick={() => {
                  deleteCanvas("posted");
                }}
              >
                <Tooltip title="Delete">
                  <DeleteForeverRoundedIcon color="action" fontSize="small" />
                </Tooltip>
              </Button>
              Likes: {paintCanvas.likeCount ? paintCanvas.likeCount : 0}{" "}
              Dislikes:{" "}
              {paintCanvas.disLikeCount ? paintCanvas.disLikeCount : 0}{" "}
            </Typography>
          )}
        </Fragment>
      ) : (
        showCanvas === "false" &&
        !showOthers && (
          <Fragment>
            <Typography>
              You have not drawn {letter} yet! add in yours
              <Button
                onClick={() => {
                  setShowCanvas("true");
                }}
              >
                <Tooltip title="Draw">
                  <EditRoundedIcon fontSize="small" />
                </Tooltip>
              </Button>
            </Typography>
          </Fragment>
        )
      )}
      {otherPaintsCount > 0 && (
        <OthersPaintsContianer>
          {showOthers && (
            <div
              onClick={() => routeChange(lang, letter)}
              role="img"
              aria-label="open"
              style={{ cursor: "pointer" }}
            >
              <Typography>{otherPaintsCount} drawings </Typography>
            </div>
          )}
          {showOthers &&
            otherPaints.map((eachPaint) => {
              return (
                <Fragment
                  key={letter + lang + eachPaint.userId + paintCanvasOperation}
                >
                  <hr></hr>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleClickOpenOthersPreview(eachPaint, letter)
                    }
                  >
                    <CanvasDraw
                      className="canvas"
                      disabled
                      canvasWidth={paintCanvasInitialState.width}
                      canvasHeight={paintCanvasInitialState.height}
                      brushRadius={paintCanvasInitialState.brushRadius}
                      lazyRadius={paintCanvasInitialState.lazyRadius}
                      saveData={eachPaint.canvasData}
                      loadTimeOffset={paintCanvasInitialState.loadTimeOffset}
                    />
                  </div>
                  <Dialog
                    open={openOthersPreview}
                    onClose={() => handleCloseOthersPreview()}
                  >
                    <OthersLetterPreview
                      canvasPreviewState={canvasPreviewState}
                      self="no"
                    />
                  </Dialog>
                  <Typography>
                    <small>by {eachPaint.userName}</small>{" "}
                  </Typography>
                  <VoteButtons
                    key={eachPaint.userId + letter}
                    letter={letter}
                    userId={eachPaint.userId}
                  />
                </Fragment>
              );
            })}
        </OthersPaintsContianer>
      )}
    </div>
  );
}

const OthersPaintsContianer = styled.div`
  background-color: #edf5ef;
  box-shadow: inset 0 0 10px white;
  margin-top: 10px;

  .canvas {
    margin-left: 35px;
    /* overflow-y: scroll; */
  }
`;
