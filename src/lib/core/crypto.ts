import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

/**
 * AES-256-GCM for OAuth tokens at rest (see PlatformConnection in
 * schema.prisma). Never call this with a value that isn't already a secret
 * you intend to decrypt later — it's authenticated encryption, not hashing;
 * ciphertext round-trips back to the exact plaintext.
 *
 * Format: `{ivHex}:{authTagHex}:{ciphertextHex}`, so the same string can be
 * stored in a single TEXT column without a second field for the IV.
 */
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit nonce, the GCM-recommended size

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes) — see .env.example.");
  }
  return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

export function decrypt(payload: string): string {
  const [ivHex, authTagHex, ciphertextHex] = payload.split(":");
  if (!ivHex || !authTagHex || !ciphertextHex) {
    throw new Error("Malformed encrypted payload — expected {iv}:{authTag}:{ciphertext}.");
  }
  const decipher = createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextHex, "hex")), decipher.final()]);
  return plaintext.toString("utf8");
}
