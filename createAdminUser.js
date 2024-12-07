// createAdminUser.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_password";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "ADMIN_SECRET";
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

(async () => {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
    await prisma.user.create({
      data: {
        username: ADMIN_USERNAME,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(
      `Admin user created with username: ${ADMIN_USERNAME} and password: ${ADMIN_PASSWORD}`
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
})();
