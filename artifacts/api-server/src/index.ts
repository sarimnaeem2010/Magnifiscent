import app from "./app";
import { logger } from "./lib/logger";
import { db, seedDatabase } from "@workspace/db";

const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 3000;

seedDatabase(db)
  .then(() => {
    app.listen(port, "0.0.0.0", (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");
    });
  })
  .catch((err: unknown) => {
    logger.error({ err }, "Database seeding failed, aborting startup");
    process.exit(1);
  });
