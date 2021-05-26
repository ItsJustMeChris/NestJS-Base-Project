import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const iv: Buffer = crypto.randomBytes(16);

export class Hash {
  iv: string;
  content: string;

  constructor(hash: Hash) {
    this.iv = hash.iv;
    this.content = this.content;
  }
}

export const encrypt = (text: string, secret: string) => {
  const key = crypto
    .createHash('sha256')
    .update(String(secret))
    .digest('base64')
    .substr(0, 32);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (hash: Hash, secret: string) => {
  const key = crypto
    .createHash('sha256')
    .update(String(secret))
    .digest('base64')
    .substr(0, 32);

  const decipher: crypto.Decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(hash.iv, 'hex'),
  );

  const decrpyted: Buffer = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
