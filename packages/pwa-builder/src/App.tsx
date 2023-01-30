import React, { useEffect, useState } from "react";
import { registry, subscribe } from "./registry";

export default function App() {
	const [fcs, setFcs] = useState<React.FC[]>(registry);
	useEffect(() => {
		const unsub = subscribe(() => {
			setFcs([...registry]);
		});
		return unsub;
	}, []);
	return (
		<>
			<div>Below are the rendered fcs</div>
			{fcs.map((FC, index) => {
				return <FC key={index} />;
			})}
		</>
	);
}
