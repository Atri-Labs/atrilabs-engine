import { Container } from "@atrilabs/core";
import { Logo } from "./Logo";

export default function () {
  return (
    <Container name="Logo" onClose={() => {}}>
      <Logo />
    </Container>
  );
}
