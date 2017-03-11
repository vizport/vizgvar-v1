var fs = require("fs");
var Protein = require("../../models/proteins");
var el;

function init(target){
  el = document.getElementById(target);
  $('.dropdown-toggle').dropdown();
  Protein.bind("refresh", render);
}

function render(){
  str = "";
  console.log('this');
  addProteins();
  el.innerHTML = el.innerHTML + str;
  selectProtein();
}


// ------------- Funciones ------------- //

function addProteins(){
  var option;
  var proteins = Protein.all();
  console.log(proteins);
  for (var i = 0; i < proteins.length; i++){
    option = '<li class="protein_item"><a href="#" class="protein_link" data-id="'+proteins[i].id+'"><div class="content"><div class="tittle">'+proteins[i].protein+'</div><div class="description">'+proteins[i].description+'</div></div><a></li>';
    str += option
  }
}



var getVariation = require("../../managers").getVariation;
var getDomain = require("../../managers").getDomain;
var getExon = require("../../managers").getExon;


function selectProtein(){
  var currentProtein;
  $('.protein_link').click(function(e) {
    e.preventDefault();
    var currentProtein = e.currentTarget.dataset.id;
    var protein = Protein.find(currentProtein);
    getExon(protein.protein_id);
    getDomain(protein.protein_id);
    getVariation(protein.protein_id);

  $('.protein_selection').hide();
  $('.charts-container').show();
  $('footer').hide();


  var thisProtein = document.getElementById("thisProtein");
  thisProtein.innerHTML = protein.protein;

  var thisProteinDesc = document.getElementById("thisProteinDesc");
  thisProteinDesc.innerHTML = protein.description;
  });

}


module.exports = init;
