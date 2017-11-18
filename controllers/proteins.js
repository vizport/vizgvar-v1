const express = require('express');

const router = express.Router();
const proteins = require('./data/vproteins.json');

router.get('/', (req, res) => {
  res.send(proteins);
});

module.exports = router;
