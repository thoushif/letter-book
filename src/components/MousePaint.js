import { useContext, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { UserContext } from "./providers/UserProvider";
import { db } from "./firebase";
import firebase from "firebase/app";
import { HuePicker } from "react-color";
import UndoIcon from "@material-ui/icons/Undo";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import { ClearAllRounded } from "@material-ui/icons";
import { Beforeunload, useBeforeunload } from "react-beforeunload";

import {
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
  Tooltip,
  Typography
} from "@material-ui/core";
import { FavoriteColor } from "./HomeLanugages/FavoriteColor";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 350,
    width: 300
  },
  brushcolor: {
    height: 50,
    width: 300
  },
  brushsize: {
    height: 50,
    width: 50
  },
  buttons: {
    height: 250,
    width: 50
  },
  control: {
    padding: theme.spacing(0)
  }
}));
export default function MousePaint(props) {
  const userObj = useContext(UserContext);
  const letter = props.paintCanvas.letter;
  const lang = props.paintCanvas.lang;
  const thisCanvas = useRef(null);

  const paintingCanvasInitialState = {
    color: "#ffc600",
    width: 300,
    height: 300,
    brushRadius: 2,
    lazyRadius: 6
  };
  const [state, setState] = useState(paintingCanvasInitialState);
  const [error, setError] = useState("=======================================");
  useBeforeunload(() => {
    // if (thisCanvas.current.getSaveData().includes("points")) {
    "You'll lose your data!";
    // }
  });

  const saveDrawingToDB = (canvasData, letter) => {
    const canvasDBObj = db
      .collection("canvasObjects")
      .doc(letter)
      .collection("users")
      .doc(userObj.uid);
    canvasDBObj.get().then((doc) => {
      if (doc.exists) {
        canvasDBObj.update({
          canvasData: canvasData,
          isActive: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          deletedAt: "",
          isPublished: false
        });
      } else {
        // db.collection("letters-written")
        //   .doc(lang + letter + userObj.uid)
        //   .set({
        //     letter: letter,
        //     userId: userObj.uid,
        //     language: lang
        //   });
        db.collection("canvasObjects")
          .doc(letter)
          .collection("users")
          .doc(userObj.uid)
          .set({
            letter: letter,
            isPublished: false,
            canvasData: canvasData,
            userId: userObj.uid,
            userName: userObj.displayName,
            voteCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isActive: true,
            likeCount: 0,
            dislikeCount: 0
          });
      }
    });
  };

  function setShowCanvas() {
    props.setShowCanvas("false");
    props.setOtherPaints([]);
  }
  const handleColorChange = (color) => {
    console.log(
      "inside mouse paint, ",
      state.color,
      " and colro hex is",
      color.hex
    );
    setState({ ...state, color: color.hex });
    console.log("after mouse paint, ", state.color);
  };
  const handleBrushChange = (size) => {
    setState({ ...state, brushRadius: Number(size) });
  };
  const classes = useStyles();

  return (
    <div className="draw">
      <Beforeunload onBeforeunload={() => "You'll lose your drawing!"} />

      <h3>
        Drawing...{letter} <small>({lang})</small>
      </h3>
      <Grid container justify="center" spacing={2}>
        <Grid key="1" item xs={8}>
          <HuePicker
            color={state.color}
            className={classes.brushcolor}
            onChangeComplete={handleColorChange}
          />
        </Grid>
        <Grid key="2" item xs={2}>
          <FavoriteColor
            brushColor={state.color}
            brushSize={state.brushRadius}
            state={state}
            setState={setState}
          />
        </Grid>
        <Grid key="3" item xs={8}>
          <CanvasDraw
            // className={classes.paper}
            canvasWidth={state.width}
            canvasHeight={state.height}
            brushRadius={state.brushRadius}
            lazyRadius={state.lazyRadius}
            brushColor={state.color}
            // ref={(canvasDraw) => (this.saveableCanvas = canvasDraw)}
            ref={thisCanvas}
            saveData={props.paintCanvas.saveData}
          />
        </Grid>
        <Grid key="4" item xs={2}>
          <ButtonGroup
            // variant="contained"
            // color="primary"
            orientation="vertical"
            aria-label="contained primary button group"
          >
            <Tooltip title="small">
              <Button
                onClick={() => handleBrushChange("2")}
                // style={{ backgroundColor: state.color }}
              >
                <div
                  className="circleBase type1"
                  style={{ backgroundColor: state.color }}
                ></div>
              </Button>
            </Tooltip>
            <Tooltip title="medium">
              <Button onClick={() => handleBrushChange("4")}>
                <div
                  className="circleBase type2"
                  style={{ backgroundColor: state.color }}
                ></div>
              </Button>
            </Tooltip>
            <Tooltip title="large">
              <Button onClick={() => handleBrushChange("6")}>
                <div
                  className="circleBase type3"
                  style={{ backgroundColor: state.color }}
                ></div>
              </Button>
            </Tooltip>
          </ButtonGroup>
          <ButtonGroup
            orientation="vertical"
            color="primary"
            aria-label="vertical contained primary button group"
            variant="text"
          >
            <Button
              onClick={() => {
                thisCanvas.current.clear();
              }}
            >
              <Tooltip title="clear full canvas">
                <ClearAllRounded fontSize="small" />
              </Tooltip>
            </Button>
            <Button
              onClick={() => {
                thisCanvas.current.undo();
              }}
            >
              {" "}
              <Tooltip title="Undo">
                <UndoIcon fontSize="small" />
              </Tooltip>
            </Button>
            <Button
              onClick={() => {
                if (!thisCanvas.current.getSaveData().includes("points")) {
                  setError("============ Draw something! =============");
                  return false;
                }
                saveDrawingToDB(
                  thisCanvas.current.getSaveData(),
                  letter,
                  userObj.uid
                );
                setShowCanvas();
              }}
            >
              <Tooltip title="Save">
                <SaveRoundedIcon style={{ fill: "#00ab66" }} fontSize="small" />
              </Tooltip>
            </Button>{" "}
            <Button
              styles={{ float: "right" }}
              onClick={() => {
                if (!thisCanvas.current.getSaveData().includes("points")) {
                  setShowCanvas();
                } else if (
                  window.confirm(
                    "This discards new changes, defaults to original/nothing. Continue?"
                  )
                )
                  setShowCanvas();
              }}
            >
              <Tooltip title="Cancel and go back">
                <ClearRoundedIcon color="secondary" />
              </Tooltip>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Typography>{error}</Typography>
    </div>
  );
}
