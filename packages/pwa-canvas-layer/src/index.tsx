import { Container } from "@atrilabs/core";
import { useCallback } from "react";
import Canvas from "./Canvas";

export default function () {
  const onClose = useCallback(() => {}, []);
  return (
    <>
      <Container name="Canvas" onClose={onClose}>
        <Canvas />
      </Container>
    </>
  );
}
