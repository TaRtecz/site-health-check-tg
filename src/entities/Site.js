import { EntitySchema  } from "typeorm";

export const Site = new EntitySchema({
  name: 'Site',
  tableName: 'sites',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    name: {
      type: 'varchar',
      length: 255
    },
    url: {
      type: 'varchar',
      length: 500
    },
    cronInterval: {
      type: 'varchar',
      default: '*/5 * * * *'
    },
    enabled: {
      type: 'boolean',
      default: true
    }
  }
});