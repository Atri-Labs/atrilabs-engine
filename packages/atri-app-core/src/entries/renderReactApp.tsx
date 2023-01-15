import React from "react";
import ReactDOM from "react-dom/client";
import "../../styles.scss";

export default function renderReactApp(App: React.FC) {
  const domContainer = document.getElementById("root")!;
  const root = ReactDOM.createRoot(domContainer);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
