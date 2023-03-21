import React from "react";
import { useCallback, useContext } from "react";
import { matchRoutes, useNavigate } from "react-router-dom";
import { RouterContext } from "../contexts/RouterContext";

type LinkProps = {
  children: React.ReactNode;
  href: string;
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
      if (matchRoutes(atriRouter.getRouter()!.routes, props.href) === null) {
        // TODO: href and route maybe different
        fetch(props.href).then(() => {
          const moduleName = "/atri/js/pages" + props.href + ".js";
          const script = document.createElement("script");
          script.src = moduleName;
          document.body.appendChild(script);
          script.onload = () => {
            atriRouter.setNavigateToWhenNewRouterLoaded(props.href);
          };
        });
      } else {
        navigate(props.href);
      }
    },
    [props]
  );
  return (
    <a onClick={onClick} href={props.href}>
      {props.children}
    </a>
  );
}
