var Model = require("clay-model");

var fields = ["type","datatype","rango","domainid","description","color"];

Domain = Model.setup("Domain", fields);

function deMenorAMayor(elem1, elem2) {return elem1-elem2;}

Domain.getRank = function(){
  var list = Domain.all();
  emptyListEndaa = [];
  emptyListStartaa = [];
  for (var i = 0; i < list.length; i++) {
    emptyListEndaa.push(list[i].end);
    emptyListStartaa.push(list[i].start);
    emptyListEndaa.sort(deMenorAMayor);
    emptyListStartaa.sort(deMenorAMayor);
  }
  var x = emptyListEndaa.length - 1;
  var first = parseInt(emptyListStartaa[0])
  var last = parseInt(emptyListEndaa[x]);
  var rank = [first,last];
  return rank
}

Domain.getTypeArray = function(){
  var list = Domain.all();
  var sourceArray = [];
  for (var i = 0; i < list.length; i++) {
    if (!sourceArray.contains(list[i].type)) {
      sourceArray.push(list[i].type);
    }
  }
  // for (var i = 0; i < sourceArray.length; i++) {
  //   sourceArray[i] = sourceArray[i]
  // }
  return sourceArray
}

Domain.grupByType = function(tipo){
  var array = Domain.findAllByAttribute("type",tipo)
  return array
}

module.exports = Domain
