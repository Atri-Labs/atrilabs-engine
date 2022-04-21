import { setApp, menu } from "@atrilabs/core";

export default function () {
  console.log("base-layer loaded");
  if (currentLayer === "root") {
    const App: React.FC = () => {
      return <div className="App"></div>;
    };
    console.log(setApp, App);
    console.log(menu("BaseHeaderMenu"));
  }
}
