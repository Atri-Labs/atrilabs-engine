import { useEffect, useContext } from "react";
import { RouterContext } from "../contexts/RouterContext";
import { useLocation, useNavigate } from "react-router-dom";
import { liveApi } from "../api/liveApi";

export function FinalPageComponent(props: {
  PageWrapper: React.FC<any>;
  Page: React.FC<any>;
}) {
  const { PageWrapper, Page } = props;
  const atriRouter = useContext(RouterContext);
  useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const route = atriRouter.removeNavigateToWhenNewRouterLoaded();
    if (route) {
      navigate(route);
      liveApi.reset();
    }
  }, [atriRouter.getRouter()]);
  useEffect(() => {
    const callback = () => {
      liveApi.reset();
    };
    window.addEventListener("popstate", callback);
    return () => {
      window.removeEventListener("popstate", callback);
    };
  }, []);
  return (
    <PageWrapper>
      <Page />
    </PageWrapper>
  );
}
