const whatsapp = require("wa-multi-session");

const startAll = async () => {
  const ids = JSON.parse(process.env.SESSION_IDS || '[]');
  for (const id of ids) {
    const session = await whatsapp.startSession(id);
    console.log(`✅ Started session: ${id}`);
  }
};

startAll();
