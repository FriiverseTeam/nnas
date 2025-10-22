const { Router } = require('express');
const { create } = require('xmlbuilder');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment-timezone');
const hash = require('../../../hash');
const { logger } = require('../../../logger');
const { AppDataSource } = require('../../../database');
const { NNID } = require('../../../entities/nnid');
const { NEXAccount } = require('../../../entities/nex-account');

const router = Router();

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  const nnidRepo = AppDataSource.getRepository(NNID);

  const userExists = await nnidRepo.findOneBy({ username });

  if (userExists) {
    res.status(400);
    return res.send(create({
      errors: {
        error: {
          code: '0100',
          message: 'Account ID already exists'
        }
      }
    }).end({ pretty: true }));
  }

  res.status(200).end();
});

router.post('/', async (req, res) => {
  const { person } = req.body;

  const nnidRepo = AppDataSource.getRepository(NNID);

  const existingUser = await nnidRepo.findOne({ where: { usernameLower: person.user_id } });
  if (existingUser) {
    res.status(400);
    return res.send(create({
      errors: {
        error: {
          code: '0100',
          message: 'Account ID already exists'
        }
      }
    }).end());
  }

  await AppDataSource.transaction(async manager => {
    const nexAccount = new NEXAccount();
    nexAccount.device_type = 'wiiu';
    await nexAccount.generatePID();
    nexAccount.generatePassword();
    nexAccount.owning_pid = nexAccount.pid;

    await manager.save(nexAccount);

    const primaryPasswordHash = hash.nintendoPasswordHash(person.password, nexAccount.pid);
    const passwordHash = await bcrypt.hash(primaryPasswordHash, 10);

    const nnid = new NNID();
    nnid.pid = nexAccount.pid;
    nnid.creation_date = new Date(moment().format('YYYY-MM-DDTHH:mm:ss'));
    nnid.updated = new Date(moment().format('YYYY-MM-DDTHH:mm:ss'));
    nnid.username = person.user_id;
    nnid.usernameLower = person.user_id.toLowerCase();
    nnid.password = passwordHash;
    nnid.birthdate = person.birth_date;
    nnid.gender = person.gender;
    nnid.country = person.country;
    nnid.language = person.language;

    nnid.email = {
      address: person.email.address.toLowerCase(),
      primary: person.email.primary === 'Y',
      parent: person.email.parent === 'Y',
      reachable: false,
      validated: person.email.validated === 'Y',
      id: crypto.randomBytes(4).readUInt32LE()
    };

    nnid.region = person.region;
    nnid.timezone = {
      name: person.tz_name,
      offset: moment.tz(person.tz_name).utcOffset() * 60
    };

    nnid.mii = {
      name: person.mii.name,
      primary: person.mii.primary === 'Y',
      data: person.mii.data,
      id: crypto.randomBytes(4).readUInt32LE(),
      hash: crypto.randomBytes(7).toString('hex'),
      image_url: '',
      image_id: crypto.randomBytes(4).readUInt32LE()
    };

    nnid.flags = {
      active: true,
      marketing: person.marketing_flag === 'Y',
      off_device: person.off_device_flag === 'Y'
    };

    nnid.identification = {
      email_code: '1',
      email_token: ''
    };

    await manager.save(nnid);

    const response = create({
      person: {
        pid: nnid.pid
      }
    }).end();

    res.send(response);

    logger.success(`Account created for ${person.user_id} with PID ${nnid.pid}.`);
  }).catch(error => {
    logger.error(`Error creating account: ${String(error)}`);
    res.status(400);
    res.send(create({
      error: {
        cause: 'Bad Request',
        code: '1600',
        message: 'Unable to process request'
      }
    }).end());
  });
});

module.exports = router;