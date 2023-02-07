import { Container } from "@atrilabs/core";
import { useCallback } from "react";
import Canvas from "./Canvas";
import { useDragListener } from "./hooks/useDragListener";

export default function () {
  const onClose = useCallback(() => {}, []);
  const { DragComp } = useDragListener();
  return (
    <>
      <Container name="Canvas" onClose={onClose}>
        <Canvas />
      </Container>
      {DragComp ? (
        <Container name="PlaygroundOverlayContainer" onClose={() => {}}>
          <DragComp.Comp {...DragComp.props} />
        </Container>
      ) : null}
    </>
  );
}
