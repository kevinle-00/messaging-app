import prisma from "../src/lib/db";
import { auth } from "../src/auth/auth";

async function main() {
  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    { email: "test1@example.com", name: "Test User 1" },
    { email: "test2@example.com", name: "Test User 2" },
    { email: "test3@example.com", name: "Test User 3" },
    { email: "test4@example.com", name: "Test User 4" },
    { email: "test5@example.com", name: "Test User 5" },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await auth.api.signUpEmail({
      body: {
        email: userData.email,
        password: "testpassword123",
        name: userData.name,
      },
    });
    console.log("Response: ", user);
    createdUsers.push(user);
    console.log("Created user:", user);
  }

  // Create conversations between all user pairs
  for (let i = 0; i < createdUsers.length; i++) {
    for (let j = i + 1; j < createdUsers.length; j++) {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: [
                { userId: createdUsers[i]!.user.id },
                { userId: createdUsers[j]!.user.id },
              ],
            },
          },
          messages: {
            create: [
              {
                content: "Long time no talk!",
                senderId: createdUsers[i]!.user.id,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              },
              {
                content: "Yeah, it's been a while!",
                senderId: createdUsers[j]!.user.id,
                createdAt: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
                ),
              },
              {
                content: "We need to catch up!",
                senderId: createdUsers[j]!.user.id,
                createdAt: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000 + 31 * 60 * 1000,
                ),
              },
              {
                content: "yo",
                senderId: createdUsers[i]!.user.id,
                createdAt: new Date(Date.now() - 5 * 60 * 1000),
              },
              {
                content: "you still up?",
                senderId: createdUsers[i]!.user.id,
                createdAt: new Date(Date.now() - 4 * 60 * 1000),
              },
              {
                content: "Hi! How are you?",
                senderId: createdUsers[j]!.user.id,
                createdAt: new Date(Date.now() - 1 * 60 * 1000),
              },
            ],
          },
        },
      });
      console.log("Created conversation:", conversation);
    }
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
