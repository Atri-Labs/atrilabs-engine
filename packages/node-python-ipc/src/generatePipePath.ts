import crypto from "crypto";

export function generatePipePath(options: {
  prefix?: string;
  suffix?: string;
}) {
  let { prefix, suffix } = options;
  prefix = prefix !== undefined ? prefix : "atri";
  suffix = suffix !== undefined ? suffix : "";
  const randomString = crypto.randomBytes(16).toString("hex");
  return `\\\\.\\pipe\\${prefix}${randomString}${suffix}`;
}
