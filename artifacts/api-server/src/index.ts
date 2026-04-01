import app from "./app";
import { logger } from "./lib/logger";
import { db, seedDatabase } from "@workspace/db";

const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 3000;

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  seedDatabase(db)
    .then(() => {
      logger.info("Database seeding complete");
    })
    .catch((err: unknown) => {
      logger.error({ err }, "Database seeding failed");
    });
});
