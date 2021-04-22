import { Fragment, useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import BrushIcon from "@material-ui/icons/Brush";
import { db } from "../firebase";
import Fab from "@material-ui/core/Fab";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";
import StarOutlinedIcon from "@material-ui/icons/StarOutlined";
import { CircularProgress } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";

export const FavoriteColor = ({ state, setState }) => {
  const userObj = useContext(UserContext);
  // const favoriteBrushInitState = {
  //   color: { hex: "#000000" },
  //   size: "medium"
  // };
  // const [favoriteBrush, setFavoriteBrush] = useState(favoriteBrushInitState);
  const [forceLoad, setForceLoad] = useState(false);
  const favoriteBrushes = db
    .collection("favorites")
    .doc(userObj.uid)
    .collection("brush");
  // const updateFavColor = () => {
  //   console.log("favorite color setting", favoriteBrush);
  //   setState({
  //     ...state,
  //     color: favoriteBrush.color.hex,
  //     brushRadius: Number(favoriteBrush.size)
  //   });
  // };
  const saveThisAsFavoriteBrush = () => {
    setForceLoad(true);
    const update = async () => {
      await favoriteBrushes
        .doc("color-size")
        .get()
        .then((favoriteBrush) => {
          console.log(favoriteBrush);
          if (favoriteBrush.exists) {
            favoriteBrushes.doc("color-size").update({
              color: state.color,
              size: state.brushRadius,
              isActive: true
            });
          } else {
            favoriteBrushes.doc("color-size").set({
              color: state.color,
              size: state.brushRadius,
              isActive: true
            });
          }
        });
    };
    update();
    const updateFlag = async () => {
      await delay(1000);
      setForceLoad(false);
    };
    updateFlag();
    console.log(
      "favorite color saving",
      state.color,
      state.brushRadius,
      forceLoad
    );
  };

  return (
    <Fragment>
      <Tooltip title="Make this as a favorite">
        <StarOutlineOutlinedIcon
          onClick={() => saveThisAsFavoriteBrush()}
          fontSize="small"
        />
      </Tooltip>

      <BrushIcon
        fontSize={
          state.brushRadius !== 2
            ? state.brushRadius === 4
              ? "medium"
              : "large"
            : "small"
        }
        style={{ fill: state.color }}
      />

      {forceLoad ? (
        <Fab size="small" variant="contained">
          <CircularProgress size={20} />
        </Fab>
      ) : (
        <DBFavColor state={state} setState={setState} />
      )}
    </Fragment>
  );
};
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const DBFavColor = ({ state, setState }) => {
  const userObj = useContext(UserContext);
  const favoriteBrushInitState = {
    color: { hex: "#000000" },
    size: "medium"
  };
  const [favoriteBrush, setFavoriteBrush] = useState(favoriteBrushInitState);

  const favoriteBrushes = db
    .collection("favorites")
    .doc(userObj.uid)
    .collection("brush");
  const updateFavColor = () => {
    console.log("favorite color setting", favoriteBrush);
    setState({
      ...state,
      color: favoriteBrush.color.hex,
      brushRadius: Number(favoriteBrush.size)
    });
  };
  const readFavoriteBrushFromDB = () => {
    setFavoriteBrush(favoriteBrushInitState);
    const dbFav = favoriteBrushes.doc("color-size").get();
    dbFav.then((favoriteBrush) => {
      console.log("favoriteBrush=====", favoriteBrush.data());
      if (favoriteBrush.data().isActive) {
        let favBrush = {
          color: {
            hex: favoriteBrush.data().color
          },
          size: favoriteBrush.data().size
        };
        setFavoriteBrush(favBrush);
        setState({
          ...state,
          color: favoriteBrush.data().color,
          brushRadius: Number(favoriteBrush.data().size)
        });
      }
    });
    // Promise.all([dbFav]).then(() => {
    //   console.log("dbfav completed", favoriteBrush);
    //   updateFavColor();
    // });
  };
  useEffect(() => {
    if (userObj) readFavoriteBrushFromDB(userObj.uid);
  }, []);
  return (
    <Fragment>
      {favoriteBrush && (
        <Tooltip title="Default/Favorite Color, Click to Use">
          <Fab
            key={+favoriteBrush.size + favoriteBrush.color}
            size="small"
            variant="contained"
            onClick={() => updateFavColor()}
            color="inherit"
          >
            <BrushIcon
              fontSize={
                favoriteBrush.size !== 2
                  ? favoriteBrush.size === 4
                    ? "medium"
                    : "large"
                  : "small"
              }
              style={{ fill: favoriteBrush.color.hex }}
            ></BrushIcon>
            <StarOutlinedIcon fontSize="small" />
          </Fab>
        </Tooltip>
      )}
    </Fragment>
  );
};
