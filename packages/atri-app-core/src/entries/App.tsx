import { useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { RouterContext } from "../contexts/RouterContext";

export default function App() {
  const router = useContext(RouterContext).getRouter();
  return <>{router !== null ? <RouterProvider router={router} /> : null}</>;
}
