const { Router } = require('express');
const xmlbuilder2 = require('xmlbuilder2');

const routes = Router();

routes.get('/@current/status', async (req, res) => {
  const xml = xmlbuilder2.create({ 
    device: '' 
  }).end({ prettyPrint: true });
  
  res.type('application/xml').send(xml);
});

module.exports = routes;