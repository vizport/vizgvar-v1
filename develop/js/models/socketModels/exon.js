var Model = require("clay-model");

var fields = ["source","datatype","start","end","exonid","startphase","endphase", "type"];

Exon = Model.setup("Exon", fields);

function deMenorAMayor(elem1, elem2) {return elem1-elem2;}

Exon.getRank = function(){
  var list = Exon.all();
  var emptyListEndaa = [];
  var emptyListStartaa = [];
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

module.exports = Exon
