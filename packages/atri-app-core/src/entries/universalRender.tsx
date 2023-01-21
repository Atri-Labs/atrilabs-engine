import renderPageOrApp from "./renderPageOrApp";
import { renderReactAppServerSide } from "./renderReactAppServerSide";

let exportedFn: any = () => {
  return "If you are reading this text, please check universalRender.tsx";
};

if (typeof window !== undefined) {
  exportedFn = renderPageOrApp;
} else {
  exportedFn = renderReactAppServerSide;
}

export default exportedFn;
