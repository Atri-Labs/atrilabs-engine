const { createHash } = require("crypto");

export default (env: any) => {
	const hash = createHash("md5");
	hash.update(JSON.stringify(env));

	return hash.digest("hex");
};
