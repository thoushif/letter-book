import { Button, IconButton, Snackbar } from "@material-ui/core";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import { Fragment, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";

export const Voice = ({ letter }) => {
  const [open, setOpen] = useState(false);
  const message = "WIP: playing how to read " + letter;

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
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
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
      />
    </Fragment>
  );
};
