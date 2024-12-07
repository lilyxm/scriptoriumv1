import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(obj) {
  return jwt.sign(obj, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}
export function generateRefreshToken(obj) {
  console.log(JWT_REFRESH_EXPIRES_IN)
  return jwt.sign(obj, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}
export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    throw new Error("Invalid token");
  }

}


