import type { ReactNode } from "react";
import { Container } from "@atrilabs/core";
import { Canvas } from "./Canvas";
export { CanvasController } from "./CanvasController";
export {
  startDrag,
  subscribeNewDrop,
  subscribeNewDrag,
  isNewDropInProgress,
} from "./hooks/useDragDrop";
export * from "./CanvasAPI";
export * from "./types";

type CanvasRuntimeProps = {
  // layers are children of runtime
  children: ReactNode | ReactNode[];
};

const CanvasRuntime: React.FC<CanvasRuntimeProps> = (props) => {
  return (
    <>
      {props.children}
      <Container name="Canvas">
        <Canvas />
      </Container>
    </>
  );
};

export default CanvasRuntime;
