import React from "react";
import ReactDOM from "react-dom/client";

/**
 *
 * @param ErrorPage <html>...</html>
 */
export default function (ErrorPage: React.ReactElement) {
  const root = ReactDOM.createRoot(document.documentElement);
  root.render(ErrorPage);
}
