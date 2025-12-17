const crypto = require("crypto");

const algorithm = "aes-256-cbc";

// Verify key length
const getKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
         // We expect a 32-byte key represented as a 64-character hex string
         console.warn("WARNING: ENCRYPTION_KEY is missing or invalid (must be 64 hex characters for 32 bytes). Encryption may fail.");
         // Fallback for dev/demo if needed, but better to error. 
         // For now, let's return Buffer from hex if valid, or handle error in encrypt/decrypt
         return null;
    }
    return Buffer.from(key, 'hex');
};

const encrypt = (text) => {
  if (!text) return text;
  
  const key = getKey();
  if (!key) throw new Error("Invalid ENCRYPTION_KEY");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Return IV:EncryptedData
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decrypt = (text) => {
  if (!text) return text;
  
  // Check if text is in valid format (IV:Data)
  const textParts = text.split(":");
  if(textParts.length !== 2) return text; // Probably old unencrypted data or invalid format

  const key = getKey();
  if (!key) throw new Error("Invalid ENCRYPTION_KEY");

  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  
  try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
  } catch (error) {
      console.error("Decryption failed:", error);
      return "[Decryption Error]"; // Don't crash
  }
};

module.exports = { encrypt, decrypt };
