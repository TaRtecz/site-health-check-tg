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
  return getSiteStatusRepository().findBy({ siteId:id });
}

export async function getAllStatuses() {
  return getSiteStatusRepository().find();
}

export async function upsertStatus(siteId, isUp) {
  return getSiteStatusRepository().upsert({ siteId, isUp }, ["siteId"]);
}

export async function checkSite(site) {
  const siteStatus = await getSiteStatusById(site.id)
  const wasUp = siteStatus[0].isUp;
  let isUp = true;
  try {
    await axios.get(site.url, { timeout: 10000 });
    isUp = true;
  } catch (e) {
    isUp = false;
  }
  console.log(`Проверка сайта ${site.name} - ${site.url}. Статус - ${isUp}`);
  await upsertStatus(site.id, isUp);
  return { isUp, wasUp };
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