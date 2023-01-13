import React from "react";

/**
 * Wraps _app with Router and contexts.
 * @param props
 * @returns
 */
export default function AppWrapper(props: { children: React.ReactElement }) {
	return <div>App wrapper is working {props.children}</div>;
}
