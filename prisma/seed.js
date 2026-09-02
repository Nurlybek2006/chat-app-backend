require("dotenv").config({
  path: ".env.test",
  override: true,
});

const bcrypt = require("bcryptjs");
const prisma = require(
  "../src/config/prisma",
);

async function main() {
  const password =
    await bcrypt.hash("123456", 10);

  const nurlibek =
    await prisma.user.upsert({
      where: {
        email: "nurlybek@test.com",
      },
      update: {},
      create: {
        email: "nurlybek@test.com",
        username: "nurlibek06",
        password,
        role: "USER",
      },
    });

  const bekzat =
    await prisma.user.upsert({
      where: {
        email:
          "sarsenbekulynurlybek06@gmail.com",
      },
      update: {},
      create: {
        email:
          "sarsenbekulynurlybek06@gmail.com",
        username: "bekzat",
        password,
        role: "USER",
      },
    });

  const dias =
    await prisma.user.upsert({
      where: {
        email: "dias@test.com",
      },
      update: {},
      create: {
        email: "dias@test.com",
        username: "dias",
        password,
        role: "USER",
      },
    });

  const existingGroup =
    await prisma.chat.findFirst({
      where: {
        name: "Backend Developers",
        isGroup: true,
      },
    });

  if (!existingGroup) {
    await prisma.chat.create({
      data: {
        name: "Backend Developers",
        isGroup: true,
        creatorId: nurlibek.id,

        members: {
          create: [
            {
              userId: nurlibek.id,
              role: "ADMIN",
            },
            {
              userId: bekzat.id,
              role: "MEMBER",
            },
            {
              userId: dias.id,
              role: "ADMIN",
            },
          ],
        },
      },
    });
  }

  console.log(
    "Test database seeded",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });