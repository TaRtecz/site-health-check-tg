import { Site } from "../entities/Site.js";
import { SiteStatus } from "../entities/SiteStatus.js";
import axios from "axios";

export async function getAllSites() {
  return Site.find();
}

export async function getAllStatuses() {
  return SiteStatus.find();
}

export async function upsertStatus(siteId, isUp) {
  return SiteStatus.upsert({ siteId, isUp }, ["siteId"]);
}

export async function checkSite(site, cache) {
  let wasUp = cache[site.url] !== false;
  let isUp = true;
  try {
    await axios.get(site.url, { timeout: 10000 });
    isUp = true;
  } catch (e) {
    isUp = false;
  }
  await upsertStatus(site.id, isUp);
  cache[site.url] = isUp;
  return { isUp, wasUp };
}

export async function createSite({ name, url, cronInterval, enabled }) {
  const site = Site.create({ name, url, cronInterval, enabled });
  await site.save();
  return site;
}

export async function updateSite(id, { name, url, cronInterval, enabled }) {
  const site = await Site.findOneBy({ id: Number(id) });
  if (!site) throw new Error("Site not found");
  if (name !== undefined) site.name = name;
  if (url !== undefined) site.url = url;
  if (cronInterval !== undefined) site.cronInterval = cronInterval;
  if (enabled !== undefined) site.enabled = enabled;
  await site.save();
  return site;
}

export async function deleteSite(id) {
  await Site.delete({ id: Number(id) });
} 