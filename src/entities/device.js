const { EntitySchema } = require('typeorm');

const DeviceAttribute = new EntitySchema({
  name: 'DeviceAttribute',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    created_date: {
      type: 'varchar',
      nullable: true,
    },
    name: {
      type: 'varchar',
      nullable: true,
    },
    value: {
      type: 'varchar',
      nullable: true,
    },
  },
});

const Device = new EntitySchema({
  name: 'Device',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    is_emulator: {
      type: Boolean,
      default: false,
    },
    model: {
      type: 'enum',
      enum: ['wup', 'ctr', 'spr', 'ftr', 'ktr', 'red', 'jan'],
      nullable: true,
    },
    device_id: {
      type: Number,
      nullable: true,
    },
    device_type: {
      type: Number,
      nullable: true,
    },
    serial: {
      type: 'varchar',
      nullable: true,
    },
    soap: {
      type: 'json',
      nullable: true,
    },
    environment: {
      type: 'varchar',
      nullable: true,
    },
    mac_hash: {
      type: 'varchar',
      nullable: true,
    },
    fcdcert_hash: {
      type: 'varchar',
      nullable: true,
    },
    linked_pids: {
      type: 'simple-array',
      nullable: true,
    },
    access_level: {
      type: Number,
      default: 0,
    },
    server_access_level: {
      type: 'varchar',
      default: 'prod',
    },
  },
  relations: {
    device_attributes: {
      type: 'one-to-many',
      target: 'DeviceAttribute',
      inverseSide: 'id',
      cascade: true,
    },
  },
});

module.exports = {
  Device,
  DeviceAttribute,
};