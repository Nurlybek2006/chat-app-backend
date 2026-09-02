const prisma = require("../../src/config/prisma");
const redis = require("../../src/config/redis");
const notificationQueue = require(
  "../../src/queues/notification.queue",
);

async function cleanupTestResources() {
  await notificationQueue.close();
  await prisma.$disconnect();
  await redis.quit();
}

module.exports = {
  cleanupTestResources,
};