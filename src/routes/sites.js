import express from "express";
import { getAllSites, getAllStatuses, createSite, updateSite, deleteSite } from "../services/siteService.js";
import { startCronForSite, stopCronForSite, restartCronForSite } from "../services/cronService.js";
import { sendUpMessage, sendDownMessage } from "../services/botService.js";
import { getAllLogs, getLogsBySite } from "../services/logService.js";

const router = express.Router();
let siteStatusCache = {};

function onStatusChange(site, isUp) {
  if (isUp) {
    sendUpMessage(site);
  } else {
    sendDownMessage(site);
  }
}

router.get("/", async (req, res) => {
  const sites = await getAllSites();
  const statuses = await getAllStatuses();
  const statusMap = Object.fromEntries(statuses.map(s => [s.siteId, s.isUp]));
  res.json(
    sites.map((site) => ({
      ...site,
      status: statusMap[site.id] === false ? "down" : "up",
    }))
  );
});

// CRUD для сайтов
router.post("/", async (req, res) => {
  const { name, url, cronInterval, enabled } = req.body;
  const site = await createSite({ name, url, cronInterval, enabled });
  startCronForSite(site, site.cronInterval, siteStatusCache, onStatusChange);
  res.status(201).json(site);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, cronInterval, enabled } = req.body;
  const site = await updateSite(id, { name, url, cronInterval, enabled });
  restartCronForSite(site, site.cronInterval, siteStatusCache, onStatusChange);
  res.json(site);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await deleteSite(id);
  stopCronForSite(id);
  res.status(204).send();
});

// Логи
router.get("/logs", async (req, res) => {
  const { limit, offset, status } = req.query;
  const logs = await getAllLogs({ limit: Number(limit) || 100, offset: Number(offset) || 0, status });
  res.json(logs);
});

router.get("/:id/logs", async (req, res) => {
  const { id } = req.params;
  const { limit, offset, status } = req.query;
  const logs = await getLogsBySite(id, { limit: Number(limit) || 100, offset: Number(offset) || 0, status });
  res.json(logs);
});

export default router; 