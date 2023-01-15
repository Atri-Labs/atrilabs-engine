import React from "react";
import { useCallback } from "react";
import { matchRoutes, useNavigate } from "react-router-dom";
import { atriRouter } from "../router/AtriRouter";

type LinkProps = {
  children: React.ReactNode;
  route: string;
};

export default function Link(props: LinkProps) {
  const navigate = useNavigate();
  const onClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (matchRoutes(atriRouter.getRouter()!.routes, props.route) === null) {
        fetch(props.route).then(() => {
          const moduleName =
            "/static/js/src/pages" + props.route + ".bundle.js";
          const script = document.createElement("script");
          script.src = moduleName;
          document.body.appendChild(script);
          navigate(props.route);
        });
      } else {
        navigate(props.route);
      }
    },
    [props]
  );
  return <a onClick={onClick}>{props.children}</a>;
}
