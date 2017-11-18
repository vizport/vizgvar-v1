const express = require('express');
const axios = require('axios');

const router = express.Router();

const vEnsemblPath = id => `http://rest.ensembl.org/overlap/translation/${id}/?feature=transcript_variation;content-type=application/json;feature=somatic_transcript_variation`;

router.get('/:id', (req, res) => {
  const id = req.params.id;
  axios.get(vEnsemblPath(id))
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      res.status(response.status).send('Error');
    });
});

module.exports = router;
