import cron from "node-cron";
import { AppDataSource } from "./db.js";
import { checkSite, setSiteStatus } from "./siteService.js";
import { sendUpMessage, sendDownMessage } from "./botService.js";
import { Cron } from "../entities/Cron.js";

// Храним задачи по siteId
const cronJobs = {};

function getCronRepository() {
  return AppDataSource.getRepository(Cron);
}

export async function getAllCrons() {
  return getCronRepository().find();
}

export async function getCronByStiteId(siteId) {
  const cron = await getCronRepository().findOneBy({ siteId });
  if (!cron) {
    console.log('Не удалось найти cronJob для сайта', siteId)
    return
  }

  return cron;
}

export async function updateIntervalCron(siteId, interval) {
  return getCronRepository().upsert({ siteId, interval }, ["siteId"]);
}

export async function updateStatusCron(siteId, status) {
  try {
    const cronJob= await getCronByStiteId(siteId);
    if (!cronJob) {
      console.log('Не удалось найти cronJob для сайта', siteId)
      return
    }
    return getCronRepository().upsert({ siteId, status }, ["siteId"]);
  } catch {
    console.log('Не удалось обновить статус для Cron задачи у сайта', siteId)
  }
}

export async function createCron(siteId, cronInterval) {
  const cronRepo = getCronRepository();
  const cron = cronRepo.create({ siteId, status: 1, interval: cronInterval });
  await cronRepo.save(cron);
  return cron;
}

export async function startCronForSite(site) {
  const cronJob = await getCronByStiteId(site.id);
  
  if (!site.enabled) {
    console.log(`Мониторинг для сайта - ${site.name} отключен.`);
    return;
  }

  if (!cronJob || cronJob.status !== 1) {
    console.log('Крон для сайта отключен или отсутсвует')
    return;
  }
  const job = cron.schedule(cronJob.interval, async () => {
    const { currentStatus, oldSiteStatus } = await checkSite(site);
    
    if (!oldSiteStatus && currentStatus) {
      sendUpMessage(site)
    } else if (oldSiteStatus && !currentStatus) {
      sendDownMessage(site)
    }
    // Обновляем статус сайта текущей проверки
    setSiteStatus(site.id, currentStatus)
  });
  
  return job
}

export function stopCronForSite(siteId) {
  if (cronJobs[siteId]) {
    cronJobs[siteId].stop();
    delete cronJobs[siteId];
  }
}

export function restartCronForSite(site) {
  stopCronForSite(site.id);
  startCronForSite(site);
}

export function stopAllCrons() {
  Object.values(cronJobs).forEach(job => job.stop());
  Object.keys(cronJobs).forEach(id => delete cronJobs[id]);
}

export async function getActiveCrons() {
  const allCrons = await getAllCrons();
  return allCrons.filter(cron => cron.status === 1)
}
