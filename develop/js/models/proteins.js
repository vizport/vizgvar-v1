var Model = require("clay-model");

var fields = ["protein","variation","domain","exon", "protein_id", "transcript_id", "description"];

Protein = Model.setup("Protein", fields);

module.exports = Protein
