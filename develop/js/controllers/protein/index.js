var fs = require("fs");
var Protein = require("../../models/proteins");
var Fuse = require("fuse.js");
var el;

function init(target){
  $('.dropdown-toggle').dropdown();
  Protein.bind("refresh", render);
}

function render(){

  var options = {
    minMatchCharLength: 3,
    matchAllTokens: true,
    threshold: 0,
    distance: 1000,
    keys: [
      "protein",
      "protein_id"
    ]
  };

  var fuse = new Fuse(Protein.all(), options);
  var resultStr = '';
  var resultsOutput = document.getElementById('protein_results');

  $( "#protein_search" ).keyup(function() {
    if ($(this).val().length > 2) {
      resultStr = '';
      var result = fuse.search($( this ).val());
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        resultStr += '<li class="prot_item" data-id="'+result[i].id+'">' + result[i].protein + ' - ' + result[i].family_description +'</li>';
      }
      resultsOutput.innerHTML = resultStr;
      selectProtein();
    }
    else {
      resultsOutput.innerHTML = '';
    }
  });
  
}

// ------------- Funciones ------------- //
function addProteins(){
  var option;
  var proteins = Protein.all();
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
  $('.prot_item').click(function(e) {
    e.preventDefault();
    var currentProtein = e.currentTarget.dataset.id;
    var protein = Protein.find(currentProtein);
    getExon(protein.protein_id);
    getDomain(protein.protein_id);
    getVariation(protein.protein_id);

  $('.protein_selection').hide();
  $('.charts-container').show();
  $('footer').hide();

  'http://rest.ensembl.org/sequence/id/'
  
  document.getElementById("btn-download-fasta").setAttribute('href', 'http://rest.ensembl.org/sequence/id/'+ protein.protein_id);
  
  var brandLink = document.getElementById("brand");
  $(brandLink).addClass('back');
  brandLink.innerHTML = '<img alt="Brand" src="https://s3.amazonaws.com/vizport.io/assets/return_icon.svg" alt=""> Return to Search';

  var thisProtein = document.getElementById("thisProtein");
  thisProtein.innerHTML = protein.protein + ': ';

  var thisProteinDesc = document.getElementById("thisProteinDesc");
  thisProteinDesc.innerHTML = protein.family_description;
  });

}


module.exports = init;
