import { useContext, useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { RouterContext } from "../contexts/RouterContext";

export default function App() {
  const atriRouter = useContext(RouterContext);
  const [router, setRouter] = useState(atriRouter.getRouter());
  useEffect(() => {
    return atriRouter.subscribe(() => {
      setRouter(atriRouter.getRouter());
    });
  }, [atriRouter]);

  return <>{router !== null ? <RouterProvider router={router} /> : null}</>;
}
