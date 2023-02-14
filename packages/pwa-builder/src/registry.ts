import React from "react";

const subscribers: (() => void)[] = [];

export const registry: React.FC[] = [];

export function subscribe(cb: () => void) {
	subscribers.push(cb);
	return () => {
		const foundIndex = subscribers.findIndex((curr) => cb === curr);
		if (foundIndex >= 0) {
			subscribers.splice(foundIndex, 1);
		}
	};
}

export function addToRegistry(fc: React.FC) {
	registry.push(fc);
	subscribers.forEach((cb) => cb());
}
