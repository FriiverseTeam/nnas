const { Router } = require('express');
const { create } = require('xmlbuilder');

const router = Router();

router.get('/@current/status', async (req, res) => {
  const response = create({
    device: ''
  }).end({ pretty: true });

  res.set('Content-Type', 'application/xml');
  res.send(response);
});

module.exports = router;