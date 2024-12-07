import { verifyToken } from "@/utils/auth";
import prisma from "@/utils/db";
// /home/lilyxm/F2024/CS309/Project/PP1/pages/api/code/templates/add.js



export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    const { code, language, title, description, tags } = req.body;
    const token = verifyToken(req);
    console.log("this is token: ", token);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (!code || !language || !title) {
        res.status(400).json({ error: 'missing required fields' });
    }
    console.log("this is tags: ", tags);

    //create/find tags
    console.log(req.body);
    //const dbtags = tags.map(name => ({ name }));

    //query code template tags if already exists, if not create new
    const dbtags = await Promise.all(tags.map(async (name) => {
        try {
            const codeTemplateTag = await prisma.codeTemplateTag.findFirst({
                where: { name: name },
            });
            if (!codeTemplateTag) {
                const newtag = await prisma.codeTemplateTag.create({
                    data: {
                        name: name,
                    }
                });
                console.log(newtag.name, newtag.id);
                return { id: newtag.id };
            } else {
                console.log(codeTemplateTag.name, codeTemplateTag.id);
                return { id: codeTemplateTag.id };
            }

        }

        catch (error) {
            console.error("Error finding or creating tag:", error);

        }
    }));

    console.log("codetemplatetags", dbtags);

    try {
        console.log("creating new template");
        const newTemplate = await prisma.codeTemplate.create({
            data: {
                title,
                description,
                code,
                language,
                author: { connect: { id: token.id } },

                CodeTemplateTag: {
                    connect: dbtags,
                },
            }
        });
        console.log("newTemplate", newTemplate);
        return res.status(200).json({ success: true, template: newTemplate });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ error: "Title already exists" });
        }
        console.error("Error creating code template:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }


}