var fs = require("fs");
var Annotation = require("../../models/socketModels/anotation");
var el;
var itemAnnotation = require("../../views/items/annotation.eco")

function init(){
  Annotation.bind("create", function() {
	console.log(' --- Annotation create event ---');
    refresh();
    clickDelete();
    downloadExons();
    downloadVariations();
    downloadDomains();
  });

  Annotation.bind("destroy", function() {
	console.log(' --- Annotation destroy event ---');
    refresh(true);
    clickDelete();
    // clickDownload();
  });

}

function exportToCsv(filename, data) {
	var keys;
	var rows = [];
	for (var i = 0; i < Object.keys(data[0]).length; i++) {
		keys.push(Object.keys(data[0])[i]);
	}
	rows.push(keys);
	for (var i = 0; i < data.length; i++) {
		var cRow = [];
		for (var l = 0; l < keys.length; l++) {
			cRow.push(data[i][keys[l]]);
		}
		rows.push(cRow);
	}

    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    console.log(rows);

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
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

function downloadExons(){
	var btn = document.getElementById('btn-download-exons')
	btn.onclick = function(e){
		var exons = Annotation.grupByType('exon');
		var exonsArray = [{
			id: "id",
			feature_type: "feature_type",
			rank: "rank",
			seq_region_name: "seq_region_name",
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
		if (exonsArray.length > 1) {
			ConvertJSON2CSV(exonsArray, 'exons-annotations')
		}

	}
}

function downloadVariations(){
	var btn = document.getElementById('btn-download-variations')
	btn.onclick = function(e){
		// console.log(Annotation.all());
		var variations = Annotation.grupByType('variation');
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
		if (variationArray.length > 1) {
			ConvertJSON2CSV(variationArray, 'variations-annotations')
		}
	}
}

function downloadDomains(){
	var btn = document.getElementById('btn-download-domains')
	btn.onclick = function(e){
		var domains = Annotation.grupByType('domain');
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
		if (domainArray.length > 1) {
			ConvertJSON2CSV(domainArray, 'domains-annotations')
		}
	}
}

 function ConvertJSON2CSV(objArray, filename){
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

        var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
	    if (navigator.msSaveBlob) { // IE 10+
	        navigator.msSaveBlob(blob, filename);
	    } else {
	        var link = document.createElement("a");
	        if (link.download !== undefined) { // feature detection
	            // Browsers that support HTML5 download attribute
	            var url = URL.createObjectURL(blob);
	            link.setAttribute("href", url);
	            link.setAttribute("download", filename);
	            link.style.visibility = 'hidden';
	            document.body.appendChild(link);
	            link.click();
	            document.body.removeChild(link);
	        }
	    }
        // window.open( "data:text/csv;charset=utf-8," + escape(str))
        
    }

module.exports = init;
