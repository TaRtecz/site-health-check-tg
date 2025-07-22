import { Log } from "../entities/Log";

export async function createLog({ siteId, status }: { siteId: number, status: string }) {
  return Log.create({ siteId, status }).save();
}

export async function getAllLogs({ limit = 100, offset = 0, status }: { limit?: number, offset?: number, status?: string } = {}) {
  const where = status ? { status } : {};
  return Log.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
}

export async function getLogsBySite(siteId: number, { limit = 100, offset = 0, status }: { limit?: number, offset?: number, status?: string } = {}) {
  const where: any = { siteId: Number(siteId) };
  if (status) where.status = status;
  return Log.find({
    where,
    order: { createdAt: "DESC" },
    take: limit,
    skip: offset,
  });
} 