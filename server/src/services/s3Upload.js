const { PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const path = require("path");

function safeExt(filename) {
  const ext = path.extname(filename || "").toLowerCase().slice(0, 10);
  return ext || "";
}

function randomKey(prefix, filename) {
  const ext = safeExt(filename);
  const id = crypto.randomBytes(16).toString("hex");
  const y = new Date().getUTCFullYear();
  const m = String(new Date().getUTCMonth() + 1).padStart(2, "0");
  return `${prefix}/${y}/${m}/${id}${ext}`;
}

async function uploadToS3({ s3, bucket, key, buffer, contentType }) {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || "application/octet-stream"
  });
  await s3.send(cmd);
}

module.exports = { randomKey, uploadToS3 };
