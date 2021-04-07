import { ButtonGroup, Button, Tooltip, Typography } from "@material-ui/core";

import { Fragment, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import VoteButtons from "../VoteActions/VoteButtons";

export default function OthersLetterPreview({ canvasPreviewState }) {
  const [previewTime, setpreviewTime] = useState(5);

  return (
    <Fragment>
      {/* {canvasPreviewState} */}
      <ButtonGroup
        variant="contained"
        color="primary"
        size="small"
        aria-label="contained primary button group"
      >
        <Button onClick={() => setpreviewTime(30)}>
          <Tooltip title="slow">
            <span>Slower</span>
          </Tooltip>
        </Button>
        <Button onClick={() => setpreviewTime(15)}>
          <Tooltip title="medium">
            <span>Medium</span>
          </Tooltip>
        </Button>
        <Button onClick={() => setpreviewTime(5)}>
          <Tooltip title="fast">
            <span>Fast</span>
          </Tooltip>
        </Button>
      </ButtonGroup>
      <OthersCanvasDraw
        canvasPreviewState={canvasPreviewState}
        previewTime={previewTime}
      />
      <Typography>
        <small>by {canvasPreviewState.eachPaint.userName}</small>{" "}
      </Typography>
      <VoteButtons
        key={
          canvasPreviewState.eachPaint.userId +
          "other" +
          canvasPreviewState.eachPaint.letter
        }
        letter={canvasPreviewState.eachPaint.letter}
        userId={canvasPreviewState.eachPaint.userId}
      />
    </Fragment>
  );
}
function OthersCanvasDraw({ canvasPreviewState, previewTime }) {
  useEffect(() => {}, [previewTime]);
  return (
    <Fragment>
      <CanvasDraw
        key={previewTime}
        disabled
        canvasWidth={canvasPreviewState.width + 100}
        canvasHeight={canvasPreviewState.height + 100}
        brushRadius={canvasPreviewState.brushRadius}
        lazyRadius={canvasPreviewState.lazyRadius}
        saveData={canvasPreviewState.eachPaint.canvasData}
        loadTimeOffset={previewTime}
      />
    </Fragment>
  );
}
