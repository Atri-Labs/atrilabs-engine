import React from "react";
import { useCallback, useContext } from "react";
import { matchRoutes, useNavigate } from "react-router-dom";
import { RouterContext } from "../contexts/RouterContext";

type LinkProps = {
  children: React.ReactNode;
  route: string;
  disabled?: boolean;
};

export default function Link(props: LinkProps) {
  const navigate = useNavigate();
  const atriRouter = useContext(RouterContext);
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (props.disabled) {
        return;
      }
      if (matchRoutes(atriRouter.getRouter()!.routes, props.route) === null) {
        fetch(props.route).then(() => {
          const moduleName = "/atri/js/pages" + props.route + ".js";
          const script = document.createElement("script");
          script.src = moduleName;
          document.body.appendChild(script);
          script.onload = () => {
            atriRouter.setNavigateToWhenNewRouterLoaded(props.route);
          };
        });
      } else {
        navigate(props.route);
      }
    },
    [props]
  );
  return <a onClick={onClick}>{props.children}</a>;
}
