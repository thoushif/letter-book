import { IconButton, Snackbar } from "@material-ui/core";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import { Fragment, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import ReactAudioPlayer from "react-audio-player";

export const Voice = ({ pronunciationAudioSrc }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Fragment>
      <RecordVoiceOverIcon
        color="primary"
        fontSize="small"
        onClick={handleClick}
      />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        action={
          <Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Fragment>
        }
      >
        <ReactAudioPlayer src={pronunciationAudioSrc} autoPlay controls />
      </Snackbar>
    </Fragment>
  );
};
