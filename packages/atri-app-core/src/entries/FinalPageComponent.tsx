import { useEffect, useContext } from "react";
import { RouterContext } from "../contexts/RouterContext";
import { useLocation, useNavigate } from "react-router-dom";

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
    }
  }, [atriRouter.getRouter()]);
  return (
    <PageWrapper>
      <Page />
    </PageWrapper>
  );
}
