import { useContext } from "react";
import { AtriScriptsContext } from "../contexts/AtriScriptsContext";

export function AtriScripts() {
  const { pages, manifestRegistry, base } = useContext(AtriScriptsContext);
  const BaseScripts = base.map((page) => {
    return <script defer src={page} key={page}></script>;
  });
  const ManifetScripts = manifestRegistry.map((src) => {
    return <script defer src={src} key={src}></script>;
  });
  const PagesScripts = pages.map((page) => {
    return <script defer src={page} key={page}></script>;
  });
  return (
    <>
      {BaseScripts}
      {ManifetScripts}
      {PagesScripts}
    </>
  );
}
