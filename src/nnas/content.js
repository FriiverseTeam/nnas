const { Router } = require('express');
const xmlbuilder2 = require('xmlbuilder2');
const timezones = require('../../timezones.json');

const routes = Router();

routes.get('/agreements/:type/:region/:version', (req, res) => {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Server', 'Nintendo 3DS (http)');
  res.setHeader('X-Nintendo-Date', String(Date.now()));

  const languages = ['English', 'Español', 'Français'];

  const agreements = languages.map(lang => ({
    country: 'US',
    language: 'en',
    language_name: lang,
    publish_date: '2014-09-29T20:07:35',
    type: 'NINTENDO-NETWORK-EULA',
    version: '0300',
    texts: {
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:type': 'chunkedStoredAgreementText',
      main_title: { '#': 'Friiverse Services Agreement' },
      agree_text: { '#': 'Accept' },
      non_agree_text: { '#': 'Decline' },
      main_text: {
        '@index': '1',
        '#': "Welcome to Friiverse Services Beta! Enjoy!"
      },
      sub_title: { '#': 'Privacy Policy' },
      sub_text: {
        '@index': '1',
        '#': "OK."
      }
    }
  }));

  const xml = xmlbuilder2.create({ agreements: { agreement: agreements } }).end({ prettyPrint: true });

  res.send(xml);
});

routes.get('/time_zones/:countryCode/:language', (req, res) => {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Server', 'Nintendo 3DS (http)');
  res.setHeader('X-Nintendo-Date', String(Date.now()));

  const { countryCode, language } = req.params;

  const regionLanguages = timezones[countryCode];
  const regionTimezones = regionLanguages[language] ? regionLanguages[language] : Object.values(regionLanguages)[0];

	const xml = xmlbuilder2.create({ timezones: { timezone: regionTimezones } }).end({ prettyPrint: true });

  res.send(xml);
});

module.exports = routes;