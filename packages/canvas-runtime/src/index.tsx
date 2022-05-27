import type { ReactNode } from "react";
import { Container } from "@atrilabs/core";
import { Canvas } from "./Canvas";
export { CanvasController } from "./CanvasController";
export { startDrag } from "./hooks/useDragDrop";

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
