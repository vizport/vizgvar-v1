var fs = require("fs");
var Annotation = require("../../models/socketModels/anotation");
var el;
var itemAnnotation = require("../../views/items/annotation.eco")

function init(){
  Annotation.bind("create", function() {
	console.log(' --- Annotation create event ---');
    refresh();
    clickDelete();
    clickDownload();
  });

  Annotation.bind("destroy", function() {
	console.log(' --- Annotation destroy event ---');
    refresh(true);
    clickDelete();
    // clickDownload();
  });

}

function refresh(destroy){
	if (destroy) {
		var variationTab = document.getElementById('variations-tab-content');
		var domainTab = document.getElementById('domains-tab-content');
		var exonTab = document.getElementById('exons-tab-content');
		variationTab.innerHTML = "";
		domainTab.innerHTML = "";
		exonTab.innerHTML = "";
	};
	refreshDOM('all-tab',Annotation.all());
	console.log(Annotation.all())
  var variations = Annotation.grupByType('variation');
  var domains = Annotation.grupByType('domain');
  var exons = Annotation.grupByType('exon');

  if (variations.length > 0) {
  	refreshDOM('variations-tab-content',variations);
  };
  if (domains.length > 0) {
  	refreshDOM('domains-tab-content',domains);
  };
  if (exons.length > 0) {
  	refreshDOM('exons-tab-content',exons);
  };
}

function refreshDOM(tab,data){
	var allTab = document.getElementById(tab)
	allTab.innerHTML = "";
	var dataLength = data.length;
	var list1 = "<div class='col-md-6'>";
	var list2 = "<div class='col-md-6'>";
	var src = "";
	for (var i = 0; i < dataLength; i++) {
		if (i % 2 === 0) {
			list1 += itemAnnotation(data[i]);
		}else{
			list2 += itemAnnotation(data[i]);
		}
	};
	list1 += "</div>";
	list2 += "</div>";
	src = list1 + list2;
	allTab.innerHTML = src;
}

function clickDelete(){
	$('.glyphicon-remove').click(function(e){
		var currentAnnotatio = Annotation.find(e.target.dataset.id);
		currentAnnotatio.destroy();
	})
}

function clickDownload(){
	var btn = document.getElementById('btn-download-annotation')
	btn.onclick = function(e){
		console.log(' --- Annotation print event ---');
		// console.log(Annotation.all());
		var variations = Annotation.grupByType('variation');
		var domains = Annotation.grupByType('domain');
		var exons = Annotation.grupByType('exon');
		var exonsArray = [{
			id: "id",
			feature_type: "feature_type",
			rank: "rank",
			seq_region_name: "seq_region_name",
			start: "start",
			end: "end",
		}];
		var domainArray = [{
			Parent: "Parent",
			id: "id",
			feature_type: "feature_type",
			seq_region_name: "seq_region_name",
			type:"type",
			start: "start",
			end: "end",
			interpro:"interpro"
		}];

		var variationArray = [{
			Parent: "Parent",
			id: "id",
			allele: "allele",
			codons:"codons",
			minor_allele_frequency:"minor_allele_frequency",
			polyphen:"polyphen",
			residues:"residues",
			sift:"sift",
			translation:"translation",
			feature_type: "feature_type",
			seq_region_name: "seq_region_name",
			type:"type",
			start: "start",
			end: "end",
		}];

		for (var i = 0; i < exons.length; i++) {
			var newObj = {
				id:exons[i].data.id,
				feature_type:exons[i].data.feature_type,
				rank:exons[i].data.rank,
				seq_region_name:exons[i].data.seq_region_name,
				start:exons[i].data.start,
				end:exons[i].data.end,
			};
			exonsArray.push(newObj)
		};

		for (var i = 0; i < domains.length; i++) {
			var newObj = {
				Parent: domains[i].data.Parent,
				id: domains[i].data.id,
				feature_type: domains[i].data.feature_type,
				seq_region_name: domains[i].data.seq_region_name,
				type:domains[i].data.type,
				start: domains[i].data.start,
				end: domains[i].data.end,
				interpro:domains[i].data.interpro
			};
			domainArray.push(newObj)
		};

		for (var i = 0; i < variations.length; i++) {
			var newObj = {
				Parent:variations[i].data.Parent,
				id: variations[i].data.id,
				allele: variations[i].data.allele,
				codons: variations[i].data.codons,
				minor_allele_frequency:variations[i].data.minor_allele_frequency,
				polyphen: variations[i].data.polyphen,
				residues:variations[i].data.residues,
				sift:variations[i].data.sift,
				translation:variations[i].data.translation,
				feature_type:variations[i].data.feature_type,
				seq_region_name: variations[i].data.seq_region_name,
				type: variations[i].data.type,
				start: variations[i].data.start,
				end: variations[i].data.end,
			};
			variationArray.push(newObj)
		};

		if (exonsArray.length > 1) {
			ConvertJSON2CSV(exonsArray)
		}
		if (domainArray.length > 1) {
			ConvertJSON2CSV(domainArray)
		}
		if (variationArray.length > 1) {
			ConvertJSON2CSV(variationArray)
		}
	}
}

 function ConvertJSON2CSV(objArray){
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
            line = line.slice(0, -1);
	        str += line + '\r\n';
        }
        window.open( "data:text/csv;charset=utf-8," + escape(str))
        
    }

module.exports = init;
