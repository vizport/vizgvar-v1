const express = require('express');
const Fuse = require('fuse.js');

const router = express.Router();
const proteins = require('./data/proteins.json');

const options = {
  minMatchCharLength: 3,
  matchAllTokens: true,
  threshold: 0,
  distance: 1000,
  keys: [
    "protein",
    "protein_id"
  ]
};

const fuse = new Fuse(proteins, options);

router.get('/search/:str', (req, res) => {
  const result = fuse.search(req.params.str);
  res.send(result);
});

module.exports = router;
