import type { ReactNode } from "react";

type CanvasRuntimeProps = {
  // layers are children of runtime
  children: ReactNode | ReactNode[];
};

const CanvasRuntime: React.FC<CanvasRuntimeProps> = (props) => {
  return <div>{props.children}</div>;
};

export default CanvasRuntime;
