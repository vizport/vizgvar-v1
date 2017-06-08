var loader = "<div class='spinner'><div class='dot1'></div><div class='dot2'></div></div>";

var $ = require('jquery');
var _ = require('lodash');


var proteins = [
	{
		protein: 'ERBB2-001',
		protein_id: 'ENSP00000462438',
		transcript_id: 'ENSP00000462438',
		description: 'ERB-B2 receptor tyrosine kinase 2',
	},
	{
		protein: 'IRF8-001',
		protein_id: 'ENSP00000268638',
		transcript_id: 'ENSP00000268638',
		description: 'Interferon regulatory factor 8',
	},
	{
		protein: 'APOC1-001',
		protein_id: 'ENSP00000465356',
		transcript_id: 'ENSP00000465356',
		description: 'Apolipoprotein C-I',
	},
	{
		protein: 'CCR5-001',
		protein_id: 'ENSP00000292303',
		transcript_id: 'ENSP00000292303',
		description: 'Chemokine (C-C motif) receptor 5 ',
	},
	{
		protein: 'SH2B1-001',
		protein_id: 'ENSP00000321221',
		transcript_id: 'ENSP00000321221',
		description: 'SH2B adaptor protein 1',
	},
	{
		protein: 'PLD3-003',
		protein_id: 'ENSP00000386293',
		transcript_id: 'ENSP00000386293',
		description: 'Phospholipase D family, member 3',
	},
]

function getProteins(){
	$.ajax({
		type: 'GET',
		url: '/proteins.json',
	})
	.done(function( data ) {
		console.log('Proteins -> ' + data.length);
		Protein.refresh(data)
	});

	// setTimeout(function(){ Protein.refresh(proteins); }, 500);
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
		// $('#chart > .spinner').hide()
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
		// $('#chart-domain > .spinner').hide()
		Domain.refresh(data)
	});

}
module.exports = {
	a:getProteins(),
	getVariation:getVariation,
	getExon:getExon,
	getDomain:getDomain
};
