import { useEffect } from "react";
import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { atriRouter } from "../router/AtriRouter";

export default function App() {
	const [router, setRouter] = useState(atriRouter.getRouter());

	useEffect(() => {
		atriRouter.subscribe(() => {
			console.log(atriRouter.getRouter()?.routes);
			setRouter(atriRouter.getRouter());
		});
	}, []);

	return <>{router !== null ? <RouterProvider router={router} /> : null}</>;
}
