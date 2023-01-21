import renderPageOrApp from "./renderPageOrApp";
import { renderReactAppServerSide } from "./renderReactAppServerSide";

let exportedFn: any = () => {
  return "If you are reading this text, please check universalRender.tsx";
};

try {
  if (window) {
    exportedFn = renderPageOrApp;
  }
} catch {
  exportedFn = renderReactAppServerSide;
}

export default exportedFn;
