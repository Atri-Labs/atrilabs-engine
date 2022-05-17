import { Menu } from "@atrilabs/core";
import { CanvasController } from "@atrilabs/canvas-runtime";
import { useState } from "react";

export default function () {
  const [showController, setShowController] = useState(false);
  return (
    <>
      {showController ? (
        <CanvasController breakpoint={{ min: 400, max: 600 }} />
      ) : null}
      <Menu name="CanvasMenu">
        <div
          onClick={() => {
            setShowController(true);
          }}
        >
          Icon
        </div>
      </Menu>
    </>
  );
}
