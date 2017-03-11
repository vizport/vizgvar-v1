var Model = require("clay-model");

var fields = ["type", "data_id","data"];

Anotation = Model.setup("Anotation", fields);

Anotation.grupByType = function(tipo){
  var array = Anotation.findAllByAttribute("type",tipo)
  return array
}

module.exports = Anotation
