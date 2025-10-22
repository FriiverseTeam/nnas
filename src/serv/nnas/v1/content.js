const { Router } = require('express');
const { create } = require('xmlbuilder');
const timezones = require('../timezones.json');

const router = Router();

router.get('/agreements/:type/:region/:version', (req, res) => {
  const response = create({
    agreements: {
      agreement: [
        {
          country: 'US',
          language: 'en',
          language_name: 'English',
          publish_date: '2014-09-29T20:07:35',
          texts: {
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:type': 'chunkedStoredAgreementText',
            main_title: { '#cdata': 'Friiverse Services Agreement' },
            agree_text: { '#cdata': 'Accept' },
            non_agree_text: { '#cdata': 'Decline' },
            main_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' },
            sub_title: { '#cdata': 'Privacy Policy' },
            sub_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' }
          },
          type: 'NINTENDO-NETWORK-EULA',
          version: '0300'
        },
        {
          country: 'US',
          language: 'en',
          language_name: 'Español',
          publish_date: '2014-09-29T20:07:35',
          texts: {
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:type': 'chunkedStoredAgreementText',
            main_title: { '#cdata': 'Friiverse Services Agreement' },
            agree_text: { '#cdata': 'Accept' },
            non_agree_text: { '#cdata': 'Decline' },
            main_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' },
            sub_title: { '#cdata': 'Privacy Policy' },
            sub_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' }
          },
          type: 'NINTENDO-NETWORK-EULA',
          version: '0300'
        },
        {
          country: 'US',
          language: 'en',
          language_name: 'Français',
          publish_date: '2014-09-29T20:07:35',
          texts: {
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@xsi:type': 'chunkedStoredAgreementText',
            main_title: { '#cdata': 'Friiverse Services Agreement' },
            agree_text: { '#cdata': 'Accept' },
            non_agree_text: { '#cdata': 'Decline' },
            main_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' },
            sub_title: { '#cdata': 'Privacy Policy' },
            sub_text: { '@index': '1', '#cdata': 'Welcome to Friiverse Beta! Enjoy!' }
          },
          type: 'NINTENDO-NETWORK-EULA',
          version: '0300'
        }
      ]
    }
  }).end({ pretty: true });

  res.set('Content-Type', 'text/xml');
  res.set('Server', 'Nintendo 3DS (http)');
  res.set('X-Nintendo-Date', new Date().getTime().toString());
  res.send(response);
});

// Credit to Pretendo Network for the timezones.json file
router.get('/time_zones/:countryCode/:language', (req, res) => {
  const { params } = req;

  const countryCode = params.countryCode;
  const language = params.language;

  const regionLanguages = timezones[countryCode];
  const regionTimezones = regionLanguages[language] ? regionLanguages[language] : Object.values(regionLanguages)[0];

  const response = create({
    timezones: {
      timezone: regionTimezones
    }
  }).end({ pretty: true });

  res.set('Content-Type', 'text/xml');
  res.set('Server', 'Nintendo 3DS (http)');
  res.set('X-Nintendo-Date', new Date().getTime().toString());
  res.send(response);
});

module.exports = router;