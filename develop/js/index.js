// // ----------- Models ----------- //
var Protein = require("./models/proteins")
//Variation Model
var Variation = require("./models/socketModels/variation");
// //Exon Model
var Exon = require("./models/socketModels/exon");
// // //Domain Model
var Domain = require("./models/socketModels/domain");

// // ----------- Controlers ----------- //
var Protein = require("./controllers/protein");
Protein("protein_list");

var Chart = require("./controllers/chart");
Chart("chart");


// var ChartUpdate = require("./controllers/chart-update/index.js");
// ChartUpdate("chart");

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

SVGElement.prototype.hasClass = function (className) {
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.getAttribute('class'));
};

SVGElement.prototype.addClass = function (className) { 
  if (!this.hasClass(className)) {
    this.setAttribute('class', this.getAttribute('class') + ' ' + className);
  }
};

SVGElement.prototype.removeClass = function (className) {
  var removedClass = this.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
  if (this.hasClass(className)) {
    this.setAttribute('class', removedClass);
  }
};

SVGElement.prototype.toggleClass = function (className) {
  if (this.hasClass(className)) {
    this.removeClass(className);
  } else {
    this.addClass(className);
  }
};

require("./managers")
