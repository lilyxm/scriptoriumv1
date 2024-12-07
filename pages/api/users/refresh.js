
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken, verifyRefreshToken } from "../../../utils/auth";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
export default function handler(req, res) {
  if (req.method === "POST") {

    //const refreshToken = verifyRefreshToken(req.body.refreshToken);
    const { refreshToken } = req.body;



    console.log("req.body", req.body);
    console.log("refreshToken", refreshToken);
    console.log("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    try {
      console.log("refreshToken", refreshToken);
      console.log("JWT_REFRESH_SECRET", JWT_REFRESH_SECRET);
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      console.log("payload", payload);
      // Generate a new access token with the same payload but a fresh expiration time

      const newAccessToken = generateToken({
        id: payload.id,
        role: payload.role,
        CreatedAt: Date.now(),
      });

      res.status(200).json({ accessToken: newAccessToken, role: payload.role });
    } catch (error) {
      return res.status(401).json({ error: error.message, message: "Unauthorized" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
