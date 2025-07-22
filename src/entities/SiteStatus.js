import { EntitySchema } from "typeorm";

export const SiteStatus = new EntitySchema({
  name: 'SiteStatus',
  tableName: 'site_statuses',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    siteId: {
      type: 'int',
      unique: true
    },
    isUp: {
      type: 'boolean',
    }
  }
}); 