import { EntitySchema } from "typeorm";

export const Cron = new EntitySchema({
  name: 'Cron',
  tableName: 'crons',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    siteId: {
      type: 'int',
    },
    status: {
      type: 'int'
    },
    interval: {
      type: 'varchar',
      length: 50
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    }
  }
}); 