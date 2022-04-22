import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Hash {
  static async toHash(value: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(value, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(stored: string, supplied: string) {
    const [storedHash, salt] = stored.split(".");
    const buf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    const suppliedHash = buf.toString("hex");
    return suppliedHash === storedHash;
  }
}
