import { BaseContainer } from "./BaseContainer";
import { Container } from "@atrilabs/core";

export default function () {
  console.log("app-design-layer loaded");
  return (
    <Container name="BaseContainer">
      <BaseContainer />
    </Container>
  );
}
