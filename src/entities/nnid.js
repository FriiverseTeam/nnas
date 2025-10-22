const { EntitySchema } = require('typeorm');

const NNID = new EntitySchema({
  name: 'NNID',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    access_level: {
      type: Number,
      default: 0,
    },
    server_access_level: {
      type: 'varchar',
      default: 'prod',
    },
    pid: {
      type: Number,
      unique: true,
      nullable: true,
    },
    creation_date: {
      type: 'varchar',
      nullable: true,
    },
    updated: {
      type: 'varchar',
      nullable: true,
    },
    username: {
      type: 'varchar',
      length: 16,
      unique: true,
      nullable: true,
    },
    usernameLower: {
      type: 'varchar',
      unique: true,
      nullable: true,
    },
    password: {
      type: 'varchar',
      nullable: true,
    },
    birthdate: {
      type: 'varchar',
      nullable: true,
    },
    gender: {
      type: 'varchar',
      nullable: true,
    },
    country: {
      type: 'varchar',
      nullable: true,
    },
    language: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'simple-json',
      nullable: true,
    },
    region: {
      type: Number,
      nullable: true,
    },
    timezone: {
      type: 'simple-json',
      nullable: true,
    },
    mii: {
      type: 'simple-json',
      nullable: true,
    },
    flags: {
      type: 'simple-json',
      nullable: true,
    },
    identification: {
      type: 'simple-json',
      nullable: true,
    },
    connections: {
      type: 'simple-json',
      nullable: true,
    },
  },
  relations: {
    devices: {
      type: 'one-to-many',
      target: 'Device',
      inverseSide: 'id',
      cascade: true,
    },
  },
  methods: {
    async generatePID() {
      const min = 1000000000;
      const max = 1799999999;

      let pid = Math.floor(Math.random() * (max - min + 1) + min);

      const repo = this.constructor.getRepository
        ? this.constructor.getRepository()
        : null;

      if (repo) {
        const inuse = await repo.findOne({ where: { pid } });
        if (inuse) return await this.generatePID();
      }

      this.pid = pid;
    },

    getServerMode() {
      return this.server_mode || 'prod';
    },
  },
});

module.exports = { NNID };