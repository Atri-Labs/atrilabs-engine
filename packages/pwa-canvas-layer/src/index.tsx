import { Container } from "@atrilabs/core";
import { useCallback } from "react";
import Canvas from "./Canvas";
import { useDragListener } from "./hooks/useDragListener";

export default function () {
  const onClose = useCallback(() => {}, []);
  const { DragComp, overlayStyle } = useDragListener();
  return (
    <>
      <Container name="Canvas" onClose={onClose}>
        <Canvas />
      </Container>
      {DragComp ? (
        <Container name="PlaygroundOverlayContainer" onClose={() => {}}>
          <div style={overlayStyle}>
            <DragComp.Comp {...DragComp.props} />
          </div>
        </Container>
      ) : null}
    </>
  );
}
