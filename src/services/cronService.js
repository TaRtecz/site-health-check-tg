import cron from "node-cron";
import { checkSite } from "./siteService.js";

// Храним задачи по siteId
const cronJobs = {};

export function startCronForSite(site, interval, cache, onStatusChange) {
  if (!site.enabled) {
    console.log(`Cron для ${site.name} отключен.`);
    return;
  }
  if (cronJobs[site.id]) {
    cronJobs[site.id].stop();
  }
  // interval — строка cron, например '*/5 * * * *'
  const job = cron.schedule(interval, async () => {
    const { isUp, wasUp } = await checkSite(site, cache);
    if (onStatusChange && isUp !== wasUp) {
      onStatusChange(site, isUp);
    }
  });
  cronJobs[site.id] = job;
}

export function stopCronForSite(siteId) {
  if (cronJobs[siteId]) {
    cronJobs[siteId].stop();
    delete cronJobs[siteId];
  }
}

export function restartCronForSite(site, interval, cache, onStatusChange) {
  stopCronForSite(site.id);
  startCronForSite(site, interval, cache, onStatusChange);
}

export function stopAllCrons() {
  Object.values(cronJobs).forEach(job => job.stop());
  Object.keys(cronJobs).forEach(id => delete cronJobs[id]);
} 