import { AppDataSource } from "./db.js";
import { Log } from "../entities/Log.js";

function getLogRepository() {
  return AppDataSource.getRepository(Log);
}

export async function createLog({ siteId, status }) {
  const repo = getLogRepository();
  const log = repo.create({ siteId, status });
  return repo.save(log);
}

export async function getAllLogs({ limit = 100, offset = 0, status } = {}) {
  const repo = getLogRepository();
  const where = status ? { status } : {};
  return repo.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
}

export async function getLogsBySite(siteId, { limit = 100, offset = 0, status } = {}) {
  const repo = getLogRepository();
  const where = { siteId: Number(siteId) };
  if (status) where.status = status;
  return repo.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
} 