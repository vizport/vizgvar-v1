var fs = require("fs");
var d3 = require("../../d3/d3.min")
window.d3= d3;

// Data Models
var Domain = require("../../models/socketModels/domain");
var Variation = require("../../models/socketModels/variation");
var Exon = require("../../models/socketModels/exon");
var Anotation = require("../../models/socketModels/anotation");

// Anotation List Controller
var AnotationList = require("../anotation-list")

var ModalDomain = require("../../views/modaldomain.eco");
var ModalDomainHTML = document.getElementById('modaldomain');

var ModalVariation = require("../../views/modalvariation.eco");
var ModalVariationHTML = document.getElementById('modalvariation');

var ModalExon = require("../../views/modalexon.eco");
var ModalExonHTML = document.getElementById('modalexon');

var el;
var min;
var max;
var currentVariableWidth;
var mouse = {x: 0, y: 0};

var currentWidth = parseInt(d3.select('.protein_selection').style('width')) * 0.93;
width = currentWidth - 20 ;

$(document).mousemove(function(event) {
    captureMousePosition(event);
}).scroll(function(event) {
    mouse.x = event.pageX + $(document).scrollLeft();
    mouse.y = event.pageY + $(document).scrollTop();
});

function captureMousePosition(event){
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}

// document.addEventListener('mousemove', function(e){
//     mouse.x = window.pageYOffset || document.documentElement.scrollTop;
//     mouse.y = window.pageXOffset || document.documentElement.scrollLeft;
// }, false);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Inicial Function //
function init(target){
  Exon.bind("refresh",function(){
      defineDomainValues();
      makeXScale(min,max);
      activeLabels();
      addRange(min,max)
      changeInput()

      renderExon()
  })

  Domain.bind("refresh", function(){
    setTimeout(function(){
      renderDomain();
    }, 5000)
  });

  Variation.bind("refresh", function(){
    setTimeout(function(){
      makeAxis()
      renderVariation()
      for (var i = 0; i < Variation.all().length; i++) {
        if(Variation.all()[i].start != Variation.all()[i].end){
          console.log(Variation.all()[i])
        }
      };
    }, 5000)
  });

  AnotationList()

}

function activeLabels(){
  $("#range > label").addClass('active');
  $("#domain > label").addClass('active');
  $("#domainsLabels > span").addClass('active')
  $("#exon > label").addClass('active');
  $("#variation > label").addClass('active')
  $("#annotations").show()
}

function addRange(minValue,maxValue){
  $( "#slider-range" ).addClass('active')
      var tooltipfirst = $('.tooltipfirst');
      var tooltiplast = $('.tooltiplast');
      $( "#slider-range" ).slider({
        range: true,
        min: minValue,
        max: maxValue,
        values: [ minValue, maxValue ],
        step: 1,

        // start: function(event,ui) {
				//     tooltipfirst.fadeIn('fast');
        //     tooltiplast.fadeIn('fast');
				// },

        change: function( event, ui ) {
          var valuefirst  = ui.values[0]
          var valuelast  = ui.values[1]
          tooltipfirst.css('left', valuefirst).text(ui.values[0]);
          tooltiplast.css('left', valuelast).text(ui.values[1]);
          update(ui.values[0],ui.values[1])
          },
        slide: function(event, ui ){
          changeInput()
        }
      })
}

function changeInput(){
  $( "#rangeInput" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " — " + $( "#slider-range" ).slider( "values", 1 ) );
}

function update(first,last){
  makeXScale(first,last)
  makeAxis()
  var element = d3.select(".axis").remove()
  drawAxis()

  var domainsRemove = d3.selectAll(".domainData").remove()
  drowDomainData()
  actionDomain()
  clickEventDomain()

  var exonRemove = d3.selectAll(".exonData").remove()
  drowExonData(allExons)
  clickEventExon()

  var variablesChartRemove = d3.selectAll(".variablePart").remove()
  rank = makeRank(first,last)
  addChartVariables(rank)

  // updateLines(first,last)
  var linksRemoved = d3.selectAll(".linksContainer").remove()
  links=[]
  sources=[]
  setSources(first,last)
  makeArrayLinks()
  drawLinks(links);
  clickEventVariation();
  // tooltips = Variation.tooltipVariations(first,last);
  // var currentId = "#variable"+first
  // var currentVariable = $(currentId)
  // var currentVariableWidth = currentVariable.width()
  // console.log(currentVariableWidth)
  // console.log(currentVariableWidth)

  // setSources(data.slice(first,last))
}

function updateLines(left,rigth){
  d3.selectAll(".link")
    .style("stroke-opacity",0)
  for (var i = left; i < rigth; i++) {
    var currentLink = ".k" + i
    d3.selectAll(currentLink)
      .style("stroke-opacity",0.4)
  }
}

function defineDomainValues(){
  rankParameters = Exon.getRank()
  min = rankParameters[0]
  max = rankParameters[1]
}

function makeXScale(x1,x2){
  xScale = d3.scale.linear()
                     .domain([x1, x2])
                     .range([0, width -20]);
}

function makeAxis(){
  axis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .tickFormat(function(d) { return d + " aa" })
            // .ticks(20)
}

// ---------------------- Domain Code ---------------------- //

function renderDomain(){
  // console.log(Domain.all())
  elementLabel = d3.selectAll(".domainsLabels").transition().duration(500).attr("width", 0).remove()
  element = d3.select(".domainChart").transition().duration(500).attr("width", 0).remove()
  sourceArray = Domain.getTypeArray()
  domainColors = ["#6CCBDE", "#C4E0C7", "#7BAAD9", "#C6E8DF", "#71CBD0", "#A5D9B1", "#8EBCE7", "#B3E6C4", "#2FB9D5", "#4094D4", "#4ABBA2", "#38D7C7", "#8DDBE7", "#71CBD0", "#8EE1AC"]
  // Define heiht while source arrray length
  if(sourceArray.length<=5){ domainHeight = 100; }; if (sourceArray.length<=9) { domainHeight = 150; }; if (sourceArray.length>9) { domainHeight = 200; }  
  domainTitleWidth = width
  yScaleDomain = d3.scale.linear()
                  .domain([0,sourceArray.length])
                  .range([0,domainHeight])


  drownDomainChart()
  $('#chart-domain > .spinner').hide()
  drowDomainlines()
  drowDomainData()
  drowDomainTitle()
  actionDomain()
  clickEventDomain()

}

function drownDomainChart(){
  domainCanvas = d3.select("#chart-domain").append("svg")
        .attr("class","domainChart")
        .attr("width", width)
        .attr("height", domainHeight)
        .append("g")
}

function drowDomainTitle(){
  var domainColor = "";
  domainLabels = d3.select("#domainsLabels").append("svg").attr("width", width).attr("height", 50).append("g").attr("class","domainsLabels")
  var domainLabel = domainLabels.selectAll(".domainLabel")
              .data(sourceArray)
              .enter()
                .append("rect")
                .attr("class", function (d,i){ return "domainContainerRect " + d + " hoberShadow"})
                .attr("width",function (d,i){ return (width  / sourceArray.length)/2 })
                .attr("height", 10)
                .attr("y", 17)
                .attr("x",function (d,i) { return (i * (width /sourceArray.length)/1.2)})
                .style("fill", function(d,i){ return domainColors[i] })

                .on("mouseover", function(d,i) {
                  d3.selectAll(".lineDomain")
                    .style("stroke-opacity",0.05)
                  d3.selectAll(".domainData")
                    .style("stroke-opacity",0.05)
                  d3.selectAll("."+ d)
                    .style("stroke-opacity",1.0)

                })

                .on("mouseout", function(d,i) {
                  d3.selectAll(".lineDomain")
                    .style("stroke-opacity",1.0)
                  d3.selectAll(".domainData")
                    .style("stroke-opacity",1.0)

                });



  var domainLabel = domainLabels.selectAll(".domainLabel")
              .data(sourceArray)
              .enter()
                .append("text")
                .attr("class", function (d,i){ return "domainLabel " + d + " hoberShadow"})
                .attr("width",function (d,i){ return (width  / sourceArray.length)/2 })
                .attr("height", 15)
                .attr("y", 15)
                .attr("x",function (d,i) { return i * ((width /sourceArray.length)/1.2)  + 5})
                .text(function (d,i) {if (true) {
                  domainColor = ".type" + domainColors[i]
                  return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, ' ');
                }})
                .style("font-size",12)
                // .style("fill", function(d,i){ return domainColors[i] })

                .on("mouseover", function(d,i) {
                  d3.selectAll(".lineDomain")
                    .style("stroke-opacity",0.05)
                  d3.selectAll(".domainData")
                    .style("stroke-opacity",0.05)
                  d3.selectAll("."+ d)
                    .style("stroke-opacity",1.0)
                })

                .on("mouseout", function(d,i) {
                  d3.selectAll(".lineDomain")
                    .style("stroke-opacity",1.0)
                  d3.selectAll(".domainData")
                    .style("stroke-opacity",1.0)

                });
}


function drowDomainlines(){
  sourceArray.forEach(function(d,i){
    domainCanvas.append('line')
                .attr("class", function(){ return "lineDomain " + d})
                .attr("x1", 0)
                .attr("y1", function(d){ return yScaleDomain(i)})
                .attr("x2", function(d){ return width - 20})
                .attr("y2", function(d){return yScaleDomain(i)})
                .attr("stroke-width", 1)
                .attr("stroke", function(d){ return domainColors[i]})
  })
}

function drowDomainData(){
  for (var m = 0; m < sourceArray.length; m++) {
    var grupData = Domain.grupByType(sourceArray[m]);
    for (var r = 0; r < grupData.length; r++) {
      domainCanvas.append("line")
                  .attr("class", function(){ if (true) {
                    return "domainData "+ sourceArray[m]
                  } })
                  .attr("id", function(){ return grupData[r].id})
                  .attr("x1", xScale(grupData[r].start))
                  .attr("y1", function(d){ return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("x2", xScale(grupData[r].end))
                  .attr("y2", function(d){return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("stroke-width", 5)
                  .attr("stroke-linecap", "round")
                  .attr("stroke", function(d){ var cd = Domain.find(grupData[r].id); cd.color = domainColors[sourceArray.indexOf(sourceArray[m])]; cd.save(); return domainColors[sourceArray.indexOf(sourceArray[m])]})
    }
  }
}

function actionDomain(){
    $(".domainData").mouseover(function(){
      var currentID = $( this ).attr("id")
      var currentDomain = Domain.find(currentID)
      var xPosition = mouse.x +20;
      var yPosition = mouse.y -80;

      //Update the tooltip position and value
      d3.select("#tooltip-domain")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px");

      d3.select("#domainid")
        .text(currentDomain.domainid);

      d3.select("#source")
        .text(currentDomain.source);

      d3.select("#description")
        .text(currentDomain.description);

      d3.select("#positionDomain")
        .text(currentDomain.start + "-" + currentDomain.end);


      //Show the tooltip
      d3.select("#tooltip-domain").classed("hidden", false);

    })

     .mouseout(function() {
       d3.select("#tooltip-domain").classed("hidden", true);
     })

}
function clickEventDomain(){
  $('.domainData').click(function(){
    var elements = document.getElementsByClassName("domainData");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addClass("desactive");
    };
    var _this = this;
    document.getElementById(this.id).removeClass("desactive");
    document.getElementById(this.id).addClass("active");
    ModalDomainHTML.innerHTML = ModalDomain(Domain.find(this.id));
    var isInAnotation = Anotation.findAllByAttribute("data_id",_this.id);
    if(isInAnotation.length >= 1){
      $('#domain-save').attr("disabled","disabled");
      $('#alredy-domain').css('display', 'inline-block');
    }
    $('#modaldomain').modal('show');
    $('#domain-save').click(function(){ 
      saveRecordToAnotation("domain",_this.id);
      $(this).attr("disabled","disabled");
      $('#success-domain').css('display', 'inline-block');
      setTimeout(function(){ $('#modaldomain').modal('hide'); }, 800);
    })
    activeLinkOnClose()
  })
}


// ---------------------- Variation Code ---------------------- //
function renderVariation(){
  el = d3.select(".variationChart").transition().duration(500).attr("width", 0).remove()
  rankParameters = Variation.getRank()
  data = Variation.all();
  var dataLength = data.length;
  typeArray = Variation.getTypeArray();
  typeLength = typeArray.length;
  sources = [];
  targets = [];
  links = [];
  rank = makeRank(min,max)
  numTot = rank.length;
  variations = Variation.grupVariations()
  // tooltips = Variation.tooltipVariations()
  //Ejecutar todas las funciones


  drawChart();
  drawAxis()
  setSources(min,max)
  addChartVariables(rank);
  makeXScaleVariationsType(typeLength)
  addChartTypes(typeArray,typeLength);
  makeArrayLinks();
  $('#chart > .spinner').hide()
  drawLinks(links);
  clickEventVariation();
}

function setSources(x1,x2){
  if (x1 && x2) {
    var i = x1;
    var count;
    for (i; i <= x2; i++) {
      count = Variation.findAllByAttribute("end", i);
      if(count.length > 0){
        for (var t = 0; t < count.length; t++) {
          sources.push(
            {source:{x:xScale(count[t].end), y: 11, type:count[t].type, id:count[t].id },
            sourceStart:{x:xScale(count[t].start), y: 11, type:count[t].type, id:count[t].id},
            sourceEnda:{x:xScale(count[t].end + 1), y: 11, type:count[t].type, id:count[t].id}
          })
        }
      }
    } 
  } else{
    var variations = Variation.all();
    for (var i = 0; i < variations.length; i++) {
      sources.push({
        source:{x:xScale(variations[i].end), y: 11, type:variations[i].type, id:variations[i].id},
        sourceStart:{x:xScale(variations[i].start), y: 11, type:variations[i].type, id:variations[i].id},
        sourceEnda:{x:xScale(variations[i].end + 1), y: 11, type:variations[i].type, id:variations[i].id}
      })
    };
  }

  // var i = x1;
  // var count;
  // for (i; i <= x2; i++) {
  //   count = Variation.findAllByAttribute("end", i);
  //   if(count.length > 0){
  //     for (var t = 0; t < count.length; t++) {
  //       sources.push({source:{x:xScale(count[t].end), y: 11, type:count[t].type, id:count[t].id }})
  //     }
  //   }
  // }
}

function makeArrayLinks(){
  for (var count = 0; count < sources.length; count++) {
    for (var intcount = 0; intcount < targets.length; intcount++) {
      if(sources[count].sourceStart.type == targets[intcount].target.type){
        var targetx = getRandomArbitrary(targets[intcount].target.minValue, targets[intcount].target.maxValue);
        links.push({start:{
            id:sources[count].source.id,
            source:{x:sources[count].sourceStart.x, y:sources[count].sourceStart.y},
            // sourceStart:{x:sources[count].sourceStart.x, y:sources[count].sourceStart.y},
            // sourceEnda:{x:sources[count].sourceEnda.x, y:sources[count].sourceEnda.y},
            // width:sources[count].source.width,
            target:{x:targetx,y:targets[intcount].target.y}
          },
          end:{
            id:sources[count].source.id,
            target:{x:sources[count].sourceEnda.x, y:sources[count].sourceEnda.y},
            // sourceStart:{x:sources[count].sourceStart.x, y:sources[count].sourceStart.y},
            // sourceEnda:{x:sources[count].sourceEnda.x, y:sources[count].sourceEnda.y},
            // width:sources[count].source.width,
            source:{x:targetx +1,y:targets[intcount].target.y}
          },
          linkData:{
            id:sources[count].source.id,
            color:targets[intcount].target.color,
            type:targets[intcount].target.type,
            target:{x:targetx,y:targets[intcount].target.y}
          }
        })
        // Save color on variation
        var currentvariation = Variation.find(sources[count].source.id);
        currentvariation.color = '#' + targets[intcount].target.color;
        currentvariation.save();
      }
    }
  }
}


//
function makeRank(first,last){
  var rank = [];
  for (var i = first; i <= last; i++) {
    rank.push(i)
  }
  return rank
}



var	margin = {top: 30, right: 20, bottom: 30, left: 50},
  // width = currentWidth,
  height = 400- margin.top - margin.bottom,
  width2 = 600 - margin.left - margin.right,
  height2 = 500 - margin.top - margin.bottom;

var colors = ["4de242", "1b74ce", "e53e3e", "00a9ac", "c6e541", "ff800d", "2935cc", "991010", "ffcf2d", "78ced8", "A858A2", "92BEE5", "2935cc", "991C1F", "ea6a62"]

// --- Funcion Main para generar el SVG --- //
function drawChart(){
  canvas = d3.select("#chart").append("svg")
        .attr("class","variationChart")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
}


function drawAxis(){
  var axisPart = canvas.append("g").attr("class", "axis")
                      .call(axis)
}

 // Funcion para agregar variables (texto y contenedor)
function addChartVariables(rango){
  var variableArray = [];
  for (var i = 0; i < rango.length; i++) {
    variableArray[i] = xScale(rango[i])
  }
  var variablePart = canvas.append("g").attr("class","variablePart")
  variableArray.forEach(function(d,i){
    variablePart.append("rect")
          .attr("id", function (d){ return "variable" + i })
          .attr("class", "variableContainer")
          .attr("width",function (d){ return (width +20) / variableArray.length })
          .attr("x", d)
          .attr("height", 12)
          .style("fill", function (d) {if ( (i % 2) == 1)
            {
              return ("#e1e1e1")
            }  else {
              return ("#c1c1c1")
            }
          })
  })
}

function makeXScaleVariations(x1,x2,widthVariation){
  xScaleVariations = d3.scale.linear()
                     .domain([x1, x2])
                     .range([0, widthVariation]);
}

function makeXScaleVariationsType(x){
  xScaleVariations = d3.scale.linear()
                     .domain([0, x])
                     .range([0, width]);
}

// Funcion para agregar tipos (contenedor y textos)
function addChartTypes(typeArray,typeLength){
  var variableTypeArray = [];
  for (var i = 0; i < typeLength; i++) {
    variableTypeArray[i] = xScaleVariations(i)
  }
  var typesPart = canvas.append("g").attr("class","typesPart")
  var blocksPart = typesPart.append("g").attr("class","blocksPart")
  typeArray.forEach(function(d,i){
    var tipeColor = "";
    var countColor = "";
    blocksPart.append("rect")
          .attr("width",function (d){ return width / typeLength })
          .attr("class", "block")
          .attr("height", 12)
          .attr("y", height)
          .attr("x", function (){ return xScaleVariations(i) })
          .style("fill", function () {
            for (var count = 0; count < colors.length; count++) {
              tipeColor = colors[i]
              countColor = ".type" + colors[i]
              return "#"+colors[i]
            }
          })

          .on("mouseover", function(d,i) {
            d3.selectAll(".link")
              .style("fill-opacity",0.05)
            d3.selectAll(countColor)
              .style("fill-opacity",0.9)
          })
          .on("mouseout", function() {
            d3.selectAll(".link")
              .style("fill-opacity",0.4)
            d3.selectAll(countColor)
              .style("fill-opacity",0.4)
          });
          var minValue = i * ( width  / typeLength ) + (( width  / typeLength )/8);
          var maxValue = i * ( width  / typeLength ) + (( width  / typeLength )/1.125);
          targets.push({target:{type:d, x: getRandomArbitrary(minValue, maxValue), y:height + 1, color:tipeColor, width:width  / typeLength, minValue:minValue, maxValue:maxValue}})
  })

  var TextPart = typesPart.append("g").attr("class","TextPart")
  typeArray.forEach(function(d,i){
    TextPart.append("text")
          .attr("width",function (d){ return i * ( width  / typeLength ) + (( width  / typeLength )/2) + 'px'  })
          .attr("height", '15px')
          .attr("y", height + 30)
          .attr("x",function (d) { return variableTypeArray[i]})
          .text(function () {return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, ' ');})
          .style("font-size",function () {
            if (d.length > 17) {
              return '10px'
            }else{
             return '12px'
            }
          })
  })
}

function defineVariationExternalLink(id){
  var sliced = id.slice(0,1);
  if (sliced === 'cos') {}
}

// Variation Events
// Modal Variation Functions onClick
function clickEventVariation(){
  $('.link').click(function(){
    var elements = document.getElementsByClassName("link");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addClass("desactive");
    };
    var _this = this;
    document.getElementById(this.id).removeClass("desactive");
    document.getElementById(this.id).addClass("active");
    var currentVariation = Variation.find(this.id);
    currentvariation.externalLink = "";
    ModalVariationHTML.innerHTML = ModalVariation(currentVariation);

    var isInAnotation = Anotation.findAllByAttribute("data_id",_this.id);

    if(isInAnotation.length >= 1){
      $('#variation-save').attr("disabled","disabled");
      $('#alredy-variation').css('display', 'inline-block');
    }

    $('#modalvariation').modal('show');


    $('#variation-save').click(function(){ 
      saveRecordToAnotation("variation",_this.id);
      $(this).attr("disabled","disabled");
      $('#success-variation').css('display', 'inline-block');
      setTimeout(function(){ $('#modalvariation').modal('hide'); }, 800);
    })

    activeLinkOnClose()
  })
}
function activeLinkOnClose(){
  $('#modalvariation').on('hidden.bs.modal', function () {
    var elements = document.getElementsByClassName("link");
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeClass("desactive");
      elements[i].removeClass("active");
    }
  })
}

// Funcion que crea los links entre elementos
function drawLinks(links){
  var linksContainer = canvas.append("g").attr("class","linksContainer")

  var diagonal = d3.svg.diagonal()
          .source(function(d) { return {"x":d.source.x, "y":d.source.y}; })
          .target(function(d) { return {"x":d.target.x, "y":d.target.y};})
          .projection(function(d) { return [d.x, d.y]; })

  links.forEach(function(data,i){
    var path1 = diagonal(data.end);
    var path2 = diagonal(data.start).replace(/^M/, 'L');
    var shape = path1 + path2 + 'Z';

    var path = linksContainer.append('path')
      .attr("id",function(){ return data.linkData.id })
      .attr("class", function(){ return "type" + data.linkData.color + " link " +"k"+ data.linkData.id })
      .classed( function(){ return data.linkData.type} )
      .style("fill",function(){ return "#" + data.linkData.color })
      .attr("d", shape)
      .on("mouseover", function(d,i) {
              d3.selectAll('.link')
                .classed("hoverDesactive", true)
              d3.select(this)
                .classed("hoverActive", true)

              var currentVariation = Variation.find(data.linkData.id)
              // console.log(currentVariation)

                var xPosition = mouse.x + 25;
                var yPosition = mouse.y - 25;

                //Update the tooltip position and value
                d3.select("#tooltip-variation")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");

                d3.select("#variationname")
                  .text(currentVariation.id);

                d3.select("#type")
                  .text(currentVariation.type);

                d3.select("#position")
                  .text(currentVariation.start + "-" + currentVariation.end);

                d3.select("#codon")
                  .text(currentVariation.codons);

                d3.select("#residues")
                  .text(currentVariation.residues);

                d3.select("#allelles")
                  .text(currentVariation.allele);

                //Show the tooltip
                d3.select("#tooltip-variation").classed("hidden", false);
            })
      .on("mouseout", function() {
        d3.selectAll('.link')
                .classed("hoverDesactive", false)
              d3.select(this)
                .classed("hoverActive", false)
        //Hide the tooltip
        d3.select("#tooltip-variation").classed("hidden", true);
      });

  })

}

// ---------------------- Exon Code ---------------------- //

function renderExon(){
  var currentElement = d3.select(".exonChart").transition().duration(500).attr("width", 0).remove()
  allExons = Exon.all()
  drownExonChart();
  drowExonData(allExons)
  clickEventExon()
}

function drownExonChart(){
  exonCanvas = d3.select("#chart-exon").append("svg")
        .attr("class","exonChart")
        .attr("width", width)
        .attr("height", 30)
        .style("margin-bottom", 20)
        .append("g")
}


function drowExonData(allExon){
  exon = exonCanvas.selectAll(".exonData")
                  .data(allExon)
                  .enter()
                    .append("line")
                    .attr("id",function(d){ return d.id })
                    .attr("class","exonData")
                    .attr("x1",function(d){ return xScale(d.start) })
                    .attr("x2", function(d){ return xScale(d.end) })
                    .attr("y1", function (d,i) {if ( (i % 2) == 1)
                      {
                        return (13)
                      }  else {
                        return (17)
                      }
                    })
                    .attr("y2", function (d,i) {if ( (i % 2) == 1)
                      {
                        return (13)
                      }  else {
                        return (17)
                      }
                    })
                    .attr("stroke-width", 5)
                    .attr("stroke", "#2094a6")
                    .attr("stroke-linecap", "round")
                    .on("mouseover", function(d) {
                      var currentExon = Exon.find(d.id)

                        var xPosition = mouse.x + 20;
                        var yPosition = mouse.y - 20 ;

                        //Update the tooltip position and value
                        d3.select("#tooltip-exon")
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px");

                        d3.select("#exonid")
                          .text(currentExon.id);

                        d3.select("#positionExon")
                          .text(d.start + "-" + d.end);

                        d3.select("#startphase")
                          .text(currentExon.startphase);

                        d3.select("#endphase")
                          .text(currentExon.endphase);

                        //Show the tooltip
                        d3.select("#tooltip-exon").classed("hidden", false);
                    })
                    .on("mouseout", function() {
                      //Hide the tooltip
                      d3.select("#tooltip-exon").classed("hidden", true);
                    });
}

function clickEventExon(){
  $('.exonData').click(function(){
    var elements = document.getElementsByClassName("exonData");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addClass("desactive");
    };
    var _this = this;
    document.getElementById(this.id).removeClass("desactive");
    document.getElementById(this.id).addClass("active");
    var currentExon = Exon.find(this.id)
    ModalExonHTML.innerHTML = ModalExon(currentExon);
    var isInAnotation = Anotation.findAllByAttribute("data_id",_this.id);
    if(isInAnotation.length >= 1){
      $('#exon-save').attr("disabled","disabled");
      $('#alredy-exon').css('display', 'inline-block');
    }
    $('#modalexon').modal('show');
    $('#exon-save').click(function(){ 
      saveRecordToAnotation("exon",_this.id);
      $(this).attr("disabled","disabled");
      $('#success-exon').css('display', 'inline-block');
      setTimeout(function(){ $('#modalexon').modal('hide'); }, 800);
    })
    activeLinkOnClose()
  })
}

// Save data on Anotation
function saveRecordToAnotation(type,id){
  if (type == "variation"){
    var anotation = Anotation.create({
      data_id: id,
      type: "variation",
      data: Variation.find(id),
    })
    anotation.save();
  }
  if (type == "exon"){
    var anotation = Anotation.create({
      data_id: id,
      type: "exon",
      data: Exon.find(id),
    })
    anotation.save();
  }
  if (type == "domain"){
    var anotation = Anotation.create({
      data_id: id,
      type: "domain",
      data: Domain.find(id),
    })
    anotation.save();
  }
}


module.exports = init;
