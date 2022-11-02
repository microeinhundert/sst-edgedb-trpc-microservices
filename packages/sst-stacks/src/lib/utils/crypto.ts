import crypto from "crypto";

export function generateRandomString() {
  return crypto.randomBytes(20).toString("hex");
}
