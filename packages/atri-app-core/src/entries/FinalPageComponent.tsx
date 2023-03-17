import { useEffect, useContext } from "react";
import { RouterContext } from "../contexts/RouterContext";
import { useLocation, useNavigate } from "react-router-dom";
import { liveApi } from "../api/liveApi";
import { subscribeInternalNavigation } from "../editor-components/live-component/callbackHandlers";

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
  }, [atriRouter.getRouter(), navigate]);
  useEffect(() => {
    const callback = () => {
      liveApi.reset();
    };
    window.addEventListener("popstate", callback);
    return () => {
      window.removeEventListener("popstate", callback);
    };
  }, []);
  // handle events here, because we have access to RouteProvider here
  useEffect(() => {
    return subscribeInternalNavigation(({ urlPath }) => {
      navigate(urlPath);
      liveApi.reset();
    });
  }, [navigate]);
  return (
    <PageWrapper>
      <Page />
    </PageWrapper>
  );
}
