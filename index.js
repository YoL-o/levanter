const { Client, logger } = require('./lib/client');
const { DATABASE, VERSION } = require('./config');
const { stopInstance } = require('./lib/pm2');

const start = async () => {
  logger.info(`levanter ${VERSION}`);

  try {
    await DATABASE.authenticate({ retry: { max: 3 } });
  } catch (error) {
    const databaseUrl = process.env.DATABASE_URL;
    logger.error({ msg: 'Unable to connect to the database', error: error.message, databaseUrl });
    return stopInstance();
  }

  let sessionIds = [];

  try {
    sessionIds = JSON.parse(process.env.SESSION_IDS);
  } catch (err) {
    if (process.env.SESSION_ID) {
      sessionIds = [process.env.SESSION_ID];
    } else {
      logger.error("❌ No SESSION_IDS or SESSION_ID provided");
      return stopInstance();
    }
  }

  for (let i = 0; i < sessionIds.length; i++) {
    const sessionId = sessionIds[i];
    try {
      const bot = new Client({ sessionId });
      logger.info(`[Session ${i}] Starting with ID: ${sessionId}`);
      await bot.connect();
    } catch (error) {
      logger.error(`[Session ${i}] Error: ${error.message}`);
    }
  }
};

start();
