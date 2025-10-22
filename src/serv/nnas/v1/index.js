const { Router } = require('express');

const router = Router();

const admin = require('./admin');
const content = require('./content');
const devices = require('./devices');
const oauth20 = require('./oauth20');
const people = require('./people');
const support = require('./support');

router.use('/api/admin', admin);
router.use('/api/content', content);
router.use('/api/devices', devices);
router.use('/api/oauth20', oauth20);
router.use('/api/people', people);
router.use('/api/support', support);

module.exports = router;