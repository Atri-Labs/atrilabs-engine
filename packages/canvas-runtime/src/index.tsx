import type { ReactNode } from "react";

type CanvasRuntimeProps = {
  children: ReactNode | ReactNode[];
};

const CanvasRuntime: React.FC<CanvasRuntimeProps> = (props) => {
  return <div>{props.children}</div>;
};

export default CanvasRuntime;
