import moduleFileExtensions from "./moduleFileExtensions";
import fs from "fs";

// Resolve file paths in the same order as webpack
export function resolveModule(
	resolveFn: (p: string) => string,
	filePath: string
) {
	const extension = moduleFileExtensions.find((extension) => {
		return fs.existsSync(resolveFn(`${filePath}.${extension}`));
	});

	if (extension) {
		return resolveFn(`${filePath}.${extension}`);
	}

	return resolveFn(`${filePath}.js`);
}
