import { EntitySchema } from "typeorm";

export const Log = new EntitySchema({
  name: 'Log',
  tableName: 'logs',
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
      type: 'varchar',
      length: 255
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    }
  }
}); 