import { useContext } from "react";
import { MainAppContext } from "../contexts/MainAppContext";

export function Main() {
  const { App } = useContext(MainAppContext);
  return <div id="__atri_app__">{App}</div>;
}
