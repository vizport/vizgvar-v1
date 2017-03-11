var Model = require("clay-model");

var fields = ["source","datatype","startaa","endaa","variationname","allelles","class","type","alternativeresidues", "color"];

Variation = Model.setup("Variation", fields);

function deMenorAMayor(elem1, elem2) {return elem1-elem2;}


Variation.getRank = function(){
  var list = Variation.all();
  emptyListEndaa = [];
  emptyListStartaa = [];
  for (var i = 0; i < list.length; i++) {
    emptyListEndaa.push(list[i].endaa);
    emptyListStartaa.push(list[i].startaa);
    emptyListEndaa.sort(deMenorAMayor);
    emptyListStartaa.sort(deMenorAMayor);
  }
  var x = emptyListEndaa.length - 1;
  var first = parseInt(emptyListStartaa[0])
  var last = parseInt(emptyListEndaa[x]);
  var rank = [first,last];
  return rank
}

Variation.getTypeArray = function(){
  var list = Variation.all();
  var typeArray = [];
  for (var i = 0; i < list.length; i++) {
    if (!typeArray.contains(list[i].type)) {
      typeArray.push(list[i].type);
    }
  }
  for (var i = 0; i < typeArray.length; i++) {
    typeArray[i] = typeArray[i]
  }
  return typeArray
}

Variation.grupVariations = function(){
  all = Variation.all();
  emptyList = [];
  for (var i = 0; i < all.length; i++) {
    // console.log(all[i].id)
    emptyList.push({variation:{id:all[i].id, startaa:all[i].startaa, endaa:all[i].endaa, type:all[i].type }})
  }
  return emptyList
}

Variation.grupByFirstLast = function(x1,x2){
  var array = Variation.slice(x1,x2)
}

// Variation.tooltipVariations = function(a,b){
//   all = Variation.all();
//   var ini,end;
//   if(a && b){
//     ini = a - 1;
//     end = b - 1;
//   }
//   else
//     {
//       ini = 0;
//       end = all.length;
//     }
//   console.log('tool',ini,end);
//   tooltips = [];
//   var i = ini;
//   for (var i; i < end; i++) {
//     var count = Variation.findAllByAttribute("endaa", i);
//       for (var t = 0; t < count.length; t++) {
//           var variationname = (count.variationname) ? count.variationname:'';
//           var allelles = (count.allelles) ? count.allelles:'';
//           var type = (count.type) ? count.type:'';
//           var alternativeresidues = (count.alternativeresidues) ? count.alternativeresidues:'';
//           var codon = (count.codon) ? count.codon:'';
//
//           tooltips.push({variationname:variationname,
//                          allelles:allelles,
//                        type:type,
//                        alternativeresidues:alternativeresidues,
//                        codon:codon});
//       }
//   }
//   return tooltips
// }

// count = Variation.findAllByAttribute("endaa", i);
// for (var t = 0; t < count.length; t++) {
//   sources.push({source:{x:xScale(count[t].endaa), y: 11, type:count[t].type, id:count[t].endaa }})
// }

module.exports = Variation
