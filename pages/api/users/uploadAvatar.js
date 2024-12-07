import path from "path";
import { writeFile } from "fs/promises";
import { Buffer } from "buffer";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import { verify } from "crypto";
import { verifyToken } from "../../../utils/auth";
import prisma from "@/utils/db";
export const config = {
    api: {
        bodyParser: false, // Disable the default body parser
    },
};
export default async function handler(req, res) {
    if (req.method === "PUT") {
        //console.log("this is req: ", req);
        //const formData = req.body.file;
        let token;
        try {
            token = verifyToken(req);
            console.log("this is token: ", token);
        } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(500).json({ error: "Failed to verify token" });
        }
        let user;
        try {
            user = await prisma.user.findUnique({
                where: {
                    id: token.id,
                },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            console.error("Error querying user:", error);
            return res.status(500).json({ error: "Failed to query user" });
        }


        const form = new IncomingForm();
        console.log("this is form: ", form);
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to parse form" });
            }

            console.log("this is fields: ", fields);
            console.log("this is files: ", files);

            const file = files.file;
            console.log("this is file: ", file);
            // Proceed to handle the file
            console.log("this is file path: ", file[0].filepath);
            const oldPath = file[0].filepath; // Get the temporary filepath
            const newFilename = `${Date.now()}_${file[0].originalFilename}`; // Clean up filename
            const newPath = path.join("public", newFilename); // Destination path
            console.log('Old Path:', oldPath);
            console.log('New Path:', newPath);
            try {
                await fs.rename(oldPath, newPath); // Move file to the public directory
            } catch (error) {
                console.error("Error moving file:", error);
                return res.status(500).json({ error: "Failed to move file." });
            }
            let profile;
            try {
                profile = await prisma.user.update({
                    where: { id: token.id },
                    data: { avatar: "/" + newFilename },
                });
            } catch (error) {
                console.error("Error updating user avatar:", error);
                return res.status(500).json({ error: "Failed to update user avatar." });
            }

            return res.status(201).json({ message: "File uploaded successfully", filename: newFilename, profile });


        });



        //console.log("this is file: ", file);
        //console.log(req.body);
        //return (res.status(200).json({ message: "File uploaded successfully" }));
    }
}