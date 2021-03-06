import { ButtonGroup, Button, Tooltip, Typography } from "@material-ui/core";

import { Fragment, useEffect, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import VoteButtons from "../VoteActions/VoteButtons";
import date from "date-and-time";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);

export default function OthersLetterPreview({ canvasPreviewState, self }) {
  const [previewTime, setpreviewTime] = useState(30);
  const [timeAgo, setTimeAgo] = useState(new TimeAgo("en-US"));
  return (
    <Fragment>
      {/* {self === "yes" ? "showing mine" : "showing others"} */}

      {self === "no" ? (
        <Fragment>
          <OthersCanvasDraw
            canvasPreviewState={canvasPreviewState}
            canvasData={canvasPreviewState.eachPaint.canvasData}
            previewTime={previewTime}
          />
          <Typography variant="subtitle2">
            by {canvasPreviewState.eachPaint.userName}(
            {timeAgo.format(
              new Date(canvasPreviewState.eachPaint.publishedAt.seconds * 1000),
              "twitter-now"
            )}
            )
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
      ) : (
        canvasPreviewState && (
          <Fragment>
            <Typography variant="h6">Your Drawing!</Typography>
            <OthersCanvasDraw
              canvasPreviewState={canvasPreviewState}
              canvasData={canvasPreviewState.saveData}
              previewTime={previewTime}
            />
          </Fragment>
        )
      )}

      <Button size="small" onClick={() => setpreviewTime(30)}>
        <Tooltip title="slow">
          <span> Show Slower</span>
        </Tooltip>
      </Button>
      <Button size="small" onClick={() => setpreviewTime(15)}>
        <Tooltip title="medium">
          <span>Medium</span>
        </Tooltip>
      </Button>
      <Button size="small" onClick={() => setpreviewTime(5)}>
        <Tooltip title="fast">
          <span>Fast</span>
        </Tooltip>
      </Button>
    </Fragment>
  );
}
function OthersCanvasDraw({ canvasPreviewState, canvasData, previewTime }) {
  useEffect(() => {}, [previewTime]);
  return (
    <Fragment>
      <CanvasDraw
        key={previewTime}
        disabled
        canvasWidth={canvasPreviewState.width + 300}
        canvasHeight={canvasPreviewState.height + 300}
        brushRadius={canvasPreviewState.brushRadius}
        lazyRadius={canvasPreviewState.lazyRadius}
        saveData={canvasData}
        loadTimeOffset={previewTime}
      />
    </Fragment>
  );
}
