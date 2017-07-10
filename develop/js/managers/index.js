var loader = "<div class='spinner'><div class='dot1'></div><div class='dot2'></div></div>";

var $ = require('jquery');
var _ = require('lodash');

function getProteins(){
	$.ajax({
		type: 'GET',
		url: '/proteins.json',
	})
	.done(function( data ) {
		console.log('Proteins -> ' + data.length);
		Protein.refresh(data)
	});
}

function getVariation(variation){
	Variation.destroyAll();
	$.ajax({
		type: 'GET',
		url: 'http://rest.ensembl.org/overlap/translation/'+ variation +'?feature=transcript_variation;content-type=application/json;feature=somatic_transcript_variation',
		beforeSend: function() {
			document.getElementById('chart').innerHTML = loader;
		}
	})
	.done(function( data ) {
		Variation.refresh(data)
	});
}

function getExon(exon){
	Exon.destroyAll();
	$.ajax({
		type: 'GET',
		url: 'http://rest.ensembl.org/overlap/translation/'+ exon +'?feature=translation_exon;content-type=application/json',
		beforeSend: function() {
			document.getElementById('chart-exon').innerHTML = loader;
		}
	})
	.done(function( data ) {
		$('#chart-exon > .spinner').hide()
		Exon.refresh(data)
	});

}

function getDomain(domain){
	Domain.destroyAll();
  	$.ajax({
		type: 'GET',
		url: 'http://rest.ensembl.org/overlap/translation/'+ domain +'?content-type=application/json',
		beforeSend: function() {
			document.getElementById('chart-domain').innerHTML = loader;
		}
	})
	.done(function( data ) {
		Domain.refresh(data)
	});

}
module.exports = {
	a:getProteins(),
	getVariation:getVariation,
	getExon:getExon,
	getDomain:getDomain
};
