import prisma from "../src/lib/db";
import { auth } from "../src/auth/auth";

async function main() {
  const users = [
    { email: "test1@example.com", name: "Test User 1" },
    { email: "test2@example.com", name: "Test User 2" },
    { email: "test3@example.com", name: "Test User 3" },
    { email: "test4@example.com", name: "Test User 4" },
    { email: "test5@example.com", name: "Test User 5" },
  ];

  for (const userData of users) {
    const user = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: "testpassword123",
        name: userData.name,
      },
    });
    console.log("Created user:", user);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });