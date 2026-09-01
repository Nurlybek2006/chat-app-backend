const { Worker } = require("bullmq");

const redis = require("../config/redis");
const transporter = require("../config/mailer");

const notificationWorker = new Worker(
  "notificationQueue",

  async (job) => {
    console.log(
      "Notification job received:",
      job.name,
      job.data,
    );

    if (job.name === "send-email") {
      const {
        email,
        title,
        content,
      } = job.data;

      const info =
        await transporter.sendMail({
          from: process.env.EMAIL_USER,

          to: email,

          subject: title,

          text: content,

          html: `
            <div>
              <h2>${title}</h2>
              <p>${content}</p>
            </div>
          `,
        });

      console.log(
        "Email sent:",
        info.messageId,
      );

      return {
        success: true,
        messageId: info.messageId,
      };
    }

    return {
      success: true,
    };
  },

  {
    connection: redis,
  },
);

notificationWorker.on(
  "completed",
  (job) => {
    console.log(
      `Job ${job.id} completed`,
    );
  },
);

notificationWorker.on(
  "failed",
  (job, error) => {
    console.error(
      `Job ${job?.id} failed:`,
      error.message,
    );
  },
);

module.exports = notificationWorker;