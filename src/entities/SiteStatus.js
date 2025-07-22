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
    },
    isUp: {
      type: 'boolean',
    }
  }
}); 