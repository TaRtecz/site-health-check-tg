import { AppDataSource } from "./db.js";
import { Site } from "../entities/Site.js";
import { SiteStatus } from "../entities/SiteStatus.js";
import axios from "axios";

function getSiteRepository() {
  return AppDataSource.getRepository(Site);
}

function getSiteStatusRepository() {
  return AppDataSource.getRepository(SiteStatus);
}

export async function getAllSites() {
  return getSiteRepository().find();
}

export async function getSiteStatusById(id) {
  const site = await getSiteStatusRepository().findOneBy({ siteId:id });
  if (!site) {
    console.log('Не удалось найти сайт', id)
    return
  }
  return site.isUp;
}

export async function getAllStatuses() {
  return getSiteStatusRepository().find();
}

export async function setSiteStatus(siteId, isUp) {
  return getSiteStatusRepository().upsert({ siteId, isUp }, ["siteId"]);
}

export async function checkSite(site) {
  const oldSiteStatus = await getSiteStatusById(site.id);
  try {
    const res = await axios.head(site.url, { timeout: 1000 });
    console.log(`Проверка сайта ${site.name} - ${site.url}. Статус - ${res.status}. Дата: ${new Date()}`);
    if (res.status === 200) {
      return { currentStatus: true, oldSiteStatus };
    } else {
      return { currentStatus: false, oldSiteStatus };
    }
  } catch (e) {
    console.log('Сайт не существует или недоступен');
    return { currentStatus: false, oldSiteStatus };
  }
}

export async function createSite({ name, url, cronInterval, enabled }) {
  const repo = getSiteRepository();
  const site = repo.create({ name, url, cronInterval, enabled });
  await repo.save(site);
  return site;
}

export async function updateSite(id, { name, url, cronInterval, enabled }) {
  const repo = getSiteRepository();
  const site = await repo.findOneBy({ id: Number(id) });
  if (!site) throw new Error("Site not found");
  if (name !== undefined) site.name = name;
  if (url !== undefined) site.url = url;
  if (cronInterval !== undefined) site.cronInterval = cronInterval;
  if (enabled !== undefined) site.enabled = enabled;
  await repo.save(site);
  return site;
}

export async function deleteSite(id) {
  await getSiteRepository().delete({ id: Number(id) });
} 
