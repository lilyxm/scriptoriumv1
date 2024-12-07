import prisma from "@/utils/db";
import { verifyToken } from "@/utils/auth";
//get specific code template by id
export default async function handler(req, res) {
    const { id } = req.query;
    console.log(id);
    console.log(parseInt(id));
    if (isNaN(parseInt(id))) { return res.status(400).json({ error: 'Invalid ID' }); }
    //---> /api/code/templates/[id] returns the code template with the given ID
    try {
        var template = await prisma.codeTemplate.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                CodeTemplateTag: true,
            }
        });
        if (!template) {
            return res.status(404).json({ error: 'Code template not found' });
        }
    } catch (error) { res.status(500).send(error); }

    console.log(template);
    if (req.method === 'GET') {
        return res.status(200).json({ template });
    }

    else if (req.method === 'PUT') {
        const { code = template.code, language = template.language, title = template.title, description = template.description, tags = template.CodeTemplateTag.map(tag => tag.name) } = req.body;
        console.log(req.body);
        //verify USERS
        let token;
        try {
            token = verifyToken(req);
        }
        catch (error) {
            return res.status(401).json({ error: "Unauthorized", message: error.message });
        }

        if (token.id !== template.id) return res.status(401).json({ error: "code template does not belong to user" });

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
        const updatedTemplate = await prisma.codeTemplate.update({
            where: { id: parseInt(id) },
            data: {
                code: code || template.code,
                language: language || template.language,
                title: title || template.title,
                description: description || template.description,
                CodeTemplateTag: { set: dbtags },
            },
            include: {
                CodeTemplateTag: true,
            }
        });
        return res.status(200).json({ updatedTemplate });
    }

    else if (req.method === 'DELETE') {

        const deletedTemplate = await prisma.codeTemplate.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({ deletedTemplate });

        //disconect tags
    }
}