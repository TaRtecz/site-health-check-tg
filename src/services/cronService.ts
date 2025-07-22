import cron, { ScheduledTask } from "node-cron";
import { Site } from "../entities/Site";
import { checkSite } from "./siteService";

const cronJobs: Record<number, ScheduledTask> = {};

export function startCronForSite(
  site: Site,
  interval: string,
  cache: Record<string, boolean>,
  onStatusChange?: (site: Site, isUp: boolean) => void
) {
  if (!site.enabled) {
    console.log(`Cron для ${site.name} отключен.`);
    return;
  }
  if (cronJobs[site.id]) {
    cronJobs[site.id].stop();
  }
  const job = cron.schedule(interval, async () => {
    const { isUp, wasUp } = await checkSite(site, cache);
    if (onStatusChange && isUp !== wasUp) {
      onStatusChange(site, isUp);
    }
  });
  cronJobs[site.id] = job;
}

export function stopCronForSite(siteId: number) {
  if (cronJobs[siteId]) {
    cronJobs[siteId].stop();
    delete cronJobs[siteId];
  }
}

export function restartCronForSite(
  site: Site,
  interval: string,
  cache: Record<string, boolean>,
  onStatusChange?: (site: Site, isUp: boolean) => void
) {
  stopCronForSite(site.id);
  startCronForSite(site, interval, cache, onStatusChange);
}

export function stopAllCrons() {
  Object.values(cronJobs).forEach((job) => job.stop());
  Object.keys(cronJobs).forEach((id) => delete cronJobs[Number(id)]);
} 