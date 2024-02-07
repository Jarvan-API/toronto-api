import crypto from "crypto";

import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

import { DecryptFailure } from "src/application/exceptions";

@Injectable()
export class EncryptionService {
  private algorithm = "aes-256-cbc";
  private secretKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = Buffer.from(configService.get<string>("ENCRYPTION_KEY"), "hex");
  }

  encrypt(value: string, key?: string): string {
    const secretKey = Boolean(key) ? Buffer.from(key, "hex") : this.secretKey;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  decrypt(hash: string, key?: string): string {
    const secretKey = Boolean(key) ? Buffer.from(key, "hex") : this.secretKey;

    try {
      const [iv, content] = hash.split(":");
      const decipher = crypto.createDecipheriv(this.algorithm, secretKey, Buffer.from(iv, "hex"));
      const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      if (error.code === "ERR_OSSL_BAD_DECRYPT") throw new DecryptFailure();
      throw error;
    }
  }
}
