import { Log } from "../entities/Log.js";

export async function createLog({ siteId, status }) {
  return Log.create({ siteId, status }).save();
}

export async function getAllLogs({ limit = 100, offset = 0, status } = {}) {
  const where = status ? { status } : {};
  return Log.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
}

export async function getLogsBySite(siteId, { limit = 100, offset = 0, status } = {}) {
  const where = { siteId: Number(siteId) };
  if (status) where.status = status;
  return Log.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
} 