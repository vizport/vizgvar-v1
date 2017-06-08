var Model = require("clay-model");
var _ = require('lodash');

var fields = ["protein","variation","domain","exon", "protein_id", "transcript_id", "description"];

Protein = Model.setup("Protein", fields);

Protein.getIds = function() {
	var t = _.map(Protein.all(), 'protein_id');
	return t;
}

module.exports = Protein
