import { Fragment, useContext, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import MousePaint from "./MousePaint";
import { UserContext } from "./providers/UserProvider";
import { db } from "./firebase";
import VoteButtons from "./VoteActions/VoteButtons";
import styled from "styled-components";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { Button, Dialog, Tooltip, Typography } from "@material-ui/core";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import OthersLetterPreview from "./ShowNames/OthersLetterPreview";

export default function MousePaintPreview({ lang, letter }) {
  const userObj = useContext(UserContext);
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
    votes: 0
  };
  const [paintCanvas, setPaintCanvas] = useState(paintCanvasInitialState);
  const [otherPaints, setOtherPaints] = useState([]);
  const [showOtherPaints, setShowOtherPaints] = useState(false);
  const [showCanvas, setShowCanvas] = useState("false");
  const [openPreview, setOpenPreview] = useState(false);

  const [canvasPreviewState, setCanvasPreviewState] = useState(
    paintCanvasInitialState
  );
  useEffect(() => {
    getCanvasData(letter);
    getCanvasAllOthersData(letter);
    return setOtherPaints([]);
  }, [letter, lang, showCanvas, userObj]);

  const handleClickOpenPreview = (eachPaint, letter) => {
    setOpenPreview(true);
    setCanvasPreviewState((canvasPreviewState) => ({
      ...canvasPreviewState,
      eachPaint: eachPaint,
      letter: letter
    }));
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
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
          setPaintCanvas({
            ...paintCanvas,
            saveData: canvasDBObj.canvasData,
            votes: canvasDBObj.voteCount
          });
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

  const getCanvasAllOthersData = (letter) => {
    console.log("working with letter ", letter);
    // const userObj = db.collection("users").doc(userId).collection("canvasObjects").doc(letter);
    let canvasDBObj;
    db.collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          canvasDBObj = doc.data();
          if (canvasDBObj.userId !== userObj.uid) {
            console.log(
              canvasDBObj.userId,
              "also wirteent ",
              canvasDBObj.letter
            );

            setOtherPaints((otherPaints) => [...otherPaints, canvasDBObj]);
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
      {paintCanvas.saveData && showCanvas === "false" ? (
        <Fragment>
          <Typography> Your Drawing!</Typography>
          <CanvasDraw
            disabled
            // imgSrc="https://cdn.pixabay.com/photo/2020/09/24/07/59/telugu-5597907_960_720.png"
            canvasWidth={paintCanvas.width + 50}
            canvasHeight={paintCanvas.height + 50}
            brushRadius={paintCanvas.brushRadius}
            lazyRadius={paintCanvas.lazyRadius}
            saveData={paintCanvas.saveData}
            gridColor="green"
            loadTimeOffset={paintCanvas.loadTimeOffset}
          />
          <Typography>
            Likes: {paintCanvas.votes}
            {showCanvas === "false" && (
              <Button
                onClick={() => {
                  setShowCanvas("true");
                }}
              >
                <Tooltip title="Edit">
                  <EditRoundedIcon fontSize="small" />
                </Tooltip>
              </Button>
            )}
          </Typography>
        </Fragment>
      ) : (
        showCanvas === "false" && (
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
      {otherPaints.length > 0 && (
        <OthersPaintsContianer>
          <div
            onClick={() => {
              setShowOtherPaints(!showOtherPaints);
            }}
            role="img"
            aria-label="open"
          >
            <Typography>
              {otherPaints.length} other(s) drew
              <Tooltip title="Show">
                <ListAltRoundedIcon
                  style={{ float: "right", cursor: "pointer" }}
                  fontSize="small"
                />
              </Tooltip>
            </Typography>
          </div>
          {showOtherPaints &&
            otherPaints.map((eachPaint) => {
              return (
                <Fragment key={letter + lang + eachPaint.userId}>
                  <hr></hr>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleClickOpenPreview(eachPaint, letter)}
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
                    open={openPreview}
                    onClose={() => handleClosePreview()}
                  >
                    <OthersLetterPreview
                      canvasPreviewState={canvasPreviewState}
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
    margin-left: 15px;
  }
`;
