import { useContext } from "react";
import { AtriScriptsContext } from "../contexts/AtriScriptsContext";

export function AtriScripts() {
  const { pages, manifestRegistry } = useContext(AtriScriptsContext);
  const Scripts = pages.map((page) => {
    return <script src={page} key={page}></script>;
  });
  return (
    <>
      {Scripts}
      <script src={manifestRegistry}></script>
    </>
  );
}
