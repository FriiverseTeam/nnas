const { Router } = require('express');
const { create } = require('xmlbuilder');
const { AppDataSource } = require('../../../database');
const { NNID } = require('../../../entities/nnid');

const router = Router();

router.get('/mapped_ids', async (req, res) => {
  const { query } = req;

  let inputStr = query.input;
  let inputType = query.input_type;
  let outputType = query.output_type;

  if (!inputStr || !inputType || !outputType) {
    res.status(400);
    return res.send(create({
      errors: {
        error: {
          cause: 'Bad Request',
          code: '1600',
          message: 'Unable to process request'
        }
      }
    }).end({ pretty: true }));
  }

  let inputList = inputStr.split(',').filter(input => input.trim() !== '');

  if (inputType === 'user_id') {
    inputType = 'usernameLower';
    inputList = inputList.map(name => name.toLowerCase());
  }

  if (outputType === 'user_id') {
    outputType = 'username';
  }

  const allowedTypes = ['pid', 'user_id'];
  const results = [];

  const nnidRepo = AppDataSource.getRepository(NNID);

  for (const input of inputList) {
    const result = { in_id: input, out_id: '' };

    if (inputType && outputType &&
        allowedTypes.includes(query.input_type) &&
        allowedTypes.includes(query.output_type)) {

      const whereClause = {};
      whereClause[inputType] = input;

      const searchResult = await nnidRepo.findOneBy(whereClause);

      if (searchResult) {
        result.out_id = searchResult[outputType] || '';
      }
    }

    results.push(result);
  }

  const response = create({
    mapped_ids: {
      mapped_id: results
    }
  }).end({ pretty: true });

  res.set('Content-Type', 'application/xml');
  res.send(response);
});

module.exports = router;