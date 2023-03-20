import os from "os";
import path from "path";
import crypto from "crypto";

export function generateSocketFilename(options: {
  prefix?: string;
  suffix?: string;
  tmpdir?: string;
}) {
  let { prefix, suffix, tmpdir } = options;
  prefix = prefix !== undefined ? prefix : "atri";
  suffix = suffix !== undefined ? suffix : "";
  tmpdir = tmpdir !== undefined ? tmpdir : os.tmpdir();
  return path.join(
    tmpdir,
    prefix + crypto.randomBytes(16).toString("hex") + suffix
  );
}
