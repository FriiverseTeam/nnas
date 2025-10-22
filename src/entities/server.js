const { EntitySchema } = require('typeorm');

const Server = new EntitySchema({
  name: 'Server',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    client_id: {
      type: 'varchar',
      nullable: true,
    },
    ip: {
      type: 'varchar',
      nullable: true,
    },
    port: {
      type: Number,
      nullable: true,
    },
    service_name: {
      type: 'varchar',
      nullable: true,
    },
    service_type: {
      type: 'varchar',
      nullable: true,
    },
    game_server_id: {
      type: 'varchar',
      nullable: true,
    },
    title_ids: {
      type: 'simple-array',
      nullable: true,
    },
    access_mode: {
      type: 'varchar',
      nullable: true,
    },
    maintenance_mode: {
      type: Boolean,
      nullable: true,
    },
    device: {
      type: Number,
      nullable: true,
    },
  },
});

module.exports = { Server };