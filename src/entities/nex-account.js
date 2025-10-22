const { EntitySchema } = require('typeorm');

const NEXAccount = new EntitySchema({
  name: 'NEXAccount',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    device_type: {
      type: 'enum',
      enum: ['wiiu', '3ds'],
      nullable: true,
    },
    pid: {
      type: Number,
      unique: true,
      nullable: true,
    },
    password: {
      type: 'varchar',
      nullable: true,
    },
    owning_pid: {
      type: Number,
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
        if (inuse) {
          return await this.generatePID();
        }
      }

      this.pid = pid;
    },

    generatePassword() {
      function character() {
        const offset = Math.floor(Math.random() * 62);
        if (offset < 10) return offset.toString();
        if (offset < 36) return String.fromCharCode(offset + 55);
        return String.fromCharCode(offset + 61);
      }

      const output = [];
      while (output.length < 16) {
        output.push(character());
      }

      this.password = output.join('');
    },
  },
});

module.exports = { NEXAccount };