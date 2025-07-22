import cron from "node-cron";
import { checkSite } from "./siteService.js";

// Храним задачи по siteId
const cronJobs = {};

export function startCronForSite(site, interval, onStatusChange) {
  if (!site.enabled) {
    console.log(`Cron для ${site.name} отключен.`);
    return;
  }
  if (cronJobs[site.id]) {
    cronJobs[site.id].stop();
  }
  // interval — строка cron, например '*/5 * * * *'
  const job = cron.schedule(interval, async () => {
    console.log('Выполняю крон');
    const { isUp, wasUp } = await checkSite(site);
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

export function restartCronForSite(site, interval, onStatusChange) {
  stopCronForSite(site.id);
  startCronForSite(site, interval, onStatusChange);
}

export function stopAllCrons() {
  Object.values(cronJobs).forEach(job => job.stop());
  Object.keys(cronJobs).forEach(id => delete cronJobs[id]);
}

export function getActiveCrons() {
  // Возвращаем массив с id и статусом (запущена или нет)
  return Object.entries(cronJobs).map(([siteId, job]) => ({
    siteId: Number(siteId),
    running: job.getStatus && job.getStatus() === 'scheduled'
  }));
} 