import "dotenv/config";
import express from "express";
import { AppDataSource } from "./src/services/db";
import sitesRouter from "./src/routes/sites";
import { getAllSites } from "./src/services/siteService";
import { startCronForSite } from "./src/services/cronService";
import { sendUpMessage, sendDownMessage } from "./src/services/botService";
import { createLog } from "./src/services/logService";
import { Site } from "./src/entities/Site";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
app.use("/sites", sitesRouter);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

const siteStatusCache: Record<string, boolean> = {};

function onStatusChange(site: Site, isUp: boolean) {
  if (isUp) {
    sendUpMessage(site);
  } else {
    sendDownMessage(site);
  }
}

AppDataSource.initialize().then(async () => {
  // Инициализация крон-задач для всех сайтов
  const sites = await getAllSites();
  for (const site of sites) {
    startCronForSite(site, site.cronInterval, siteStatusCache, async (site, isUp) => {
      await createLog({ siteId: site.id, status: isUp ? 'up' : 'down' });
      onStatusChange(site, isUp);
    });
  }

  app.listen(PORT, () => {
    console.log(`Web-интерфейс: http://localhost:${PORT}`);
  });
}); 