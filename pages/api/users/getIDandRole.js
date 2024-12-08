import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    console.log("this req.body", req.body);

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const payload = await verifyToken(req);
        const { id, role } = payload;

        return res.status(200).json({ id, role });
    } catch (error) {
        console.error(error);
        if (error.message === "Token expired") {
            return res.status(402).json({ error: "Token expired" });
        }
        return res
            .status(401)
            .json({ message: "Invalid token", error: error.message });
    }
}
