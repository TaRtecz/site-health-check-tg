import "dotenv/config";
import express from "express";
import { AppDataSource } from "./src/services/db.js";
import sitesRouter from "./src/routes/sites.js";
import cronsRouter from "./src/routes/crons.js";
import { getAllSites } from "./src/services/siteService.js";
import { startCronForSite } from "./src/services/cronService.js";
import { sendUpMessage, sendDownMessage } from "./src/services/botService.js";
import { createLog } from "./src/services/logService.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/sites", sitesRouter);
app.use("/api/crons", cronsRouter);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

function onStatusChange(site, isUp) {
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
    startCronForSite(site);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web-интерфейс`);
  });
});
