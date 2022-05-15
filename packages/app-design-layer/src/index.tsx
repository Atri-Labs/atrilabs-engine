import { BaseContainer } from "./BaseContainer";
import { baseContainer } from "./required";

export default function () {
  console.log("app-design-layer loaded");
  baseContainer.register({ comp: BaseContainer, props: {} });
  return <div>Shyam Swaroop</div>;
}
