import { container } from "@atrilabs/core";
import { Logo } from "./Logo";

export default function () {
  const logoContainer = container("Logo");

  if (!logoContainer) {
    console.log("A container with name Logo is required");
  } else {
    logoContainer.register({ comp: Logo, props: {} });
  }
}
