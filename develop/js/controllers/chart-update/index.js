var fs = require("fs");
var d3 = require("../../d3/d3.min")
window.d3= d3;

console.log(crossfilter.version)

// Data Models
var Domain = require("../../models/socketModels/domain");
var Variation = require("../../models/socketModels/variation");
var Exon = require("../../models/socketModels/exon");
var Anotation = require("../../models/socketModels/anotation");

// Anotation List Controller
var AnotationList = require("../anotation-list");

var ModalVariation = require("../../views/modalvariation.eco");
var ModalVariationHTML = document.getElementById('modalvariation');

var el;
var min;
var max;
var arrayOfTargets = [];
var currentVariableWidth;
var mouse = {x: 0, y: 0};

// Cross Variables



var crossSources = crossfilter([]);
allSources = crossSources.dimension(function(d) { return d.endaa; });

var crossLinks = crossfilter([]);
allLinks = crossLinks.dimension(function(d) { return d; });
// allLinks.filterAll();

linksByStart = crossLinks.dimension(function(d) { return d.startaa; });
linksByStart.filterAll();

document.addEventListener('mousemove', function(e){
    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY
}, false);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Inicial Function //
function init(target){
  Domain.bind("refresh", function(){
    setTimeout(function(){
      renderDomain();
    }, 300)
  });

  Variation.bind("refresh", function(){
    setTimeout(function(){
      makeAxis();
      crossVariation = crossfilter(Variation.all())
      
      renderVariation();
    }, 500)
  });
  Exon.bind("refresh",function(){
      defineDomainValues();
      makeXScale(min,max);
      activeLabels();
      addRange(min,max)
      changeInput()
      renderExon()
  })

  AnotationList()

}

function activeLabels(){
  $("#range > label").addClass('active');
  $("#domain > label").addClass('active');
  $("#domainsLabels > span").addClass('active')
  $("#exon > label").addClass('active');
  $("#variation > label").addClass('active')
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
        // step: 5,

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
        slide: function(event, ui){
          changeInput()
        }
      })
}

function changeInput(){
  $( "#rangeInput" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " — " + $( "#slider-range" ).slider( "values", 1 ) );
}

function update(first,last){
  // crossVariation.remove()
  // crossSources.remove()
  // crossLinks.remove()

  makeXScale(first,last)
  makeAxis()
  
  var element = d3.select(".axis").remove()
  drawAxis()

  var domainsRemove = d3.selectAll(".domainData").remove()
  drowDomainData()
  actionDomain()

  var exonRemove = d3.selectAll(".exonData").remove()
  drowExonData(allExons)

  var variablesChartRemove = d3.selectAll(".variablePart").remove()
  rank = makeRank(first,last)
  addChartVariables(rank)

  // updateLines(first,last)
  // var linksRemoved = d3.selectAll(".links").remove()
  // sources=[]
  // setSources(first,last)
  // makeArrayLinks()
  // console.log(first)

  linksByStart.filterRange([first,last])

  // linksByStart.top(Infinity).forEach(function(d, i){console.log(d.startaa)})

  linksPaths.refresh()

  // drawLinks(links);
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
                     .range([0, width]);
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
  elementLabel = d3.selectAll(".domainsLabels").transition().duration(500).attr("width", 0).remove()
  element = d3.select(".domainChart").transition().duration(500).attr("width", 0).remove()
  sourceArray = Domain.getTypeArray()
  domainColors = ["#030303","#525252","#7d7d7d","#949494","#b3b3b3","#d3d3d3"]
  domainHeight = 100;
  domainTitleWidth = width
  yScaleDomain = d3.scale.linear()
                  .domain([0,sourceArray.length])
                  .range([0,domainHeight])


  drownDomainChart()
  drowDomainlines()
  drowDomainData()
  drowDomainTitle()
  actionDomain()

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
                .attr("x",function (d,i) { return (i * (width /sourceArray.length)/2)})
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
                .attr("x",function (d,i) { return i * ((width /sourceArray.length)/2)  + 10})
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
                .attr("x2", width)
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
                  .attr("x1", xScale(grupData[r].rango[0]))
                  .attr("y1", function(d){ return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("x2", xScale(grupData[r].rango[1]))
                  .attr("y2", function(d){return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("stroke-width", 5)
                  .attr("stroke-linecap", "round")
                  .attr("stroke", function(d){ return domainColors[sourceArray.indexOf(sourceArray[m])]})
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
        .text(currentDomain.startaa + "-" + currentDomain.endaa);


      //Show the tooltip
      d3.select("#tooltip-domain").classed("hidden", false);

    })

     .mouseout(function() {
       d3.select("#tooltip-domain").classed("hidden", true);
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

  targets= [];
  rank = makeRank(min,max)
  numTot = rank.length;
  // variations = Variation.grupVariations()
  // tooltips = Variation.tooltipVariations()
  //Ejecutar todas las funciones

  var crossVariation = crossfilter(Variation.all());

  // Dimensions
  byTypeVariation = crossVariation.dimension(function(d) { return d.type; });


  var groupByTypeVariations = byTypeVariation.group();
  console.log("Agrupacion por type - " + groupByTypeVariations.size())
  groupByTypeVariations.top(Infinity).forEach(function(d, i){
    console.log(d.key + " - " + d.value)
  })

  drawChart();
  drawAxis()
  setSources()
  addChartVariables(rank);
  makeXScaleVariationsType(typeLength)
  addChartTypes(typeArray,typeLength);
  makeArrayLinks();
  linksPaths = drawLinks(allLinks);
  clickEventVariation();
}


function setSources(x1,x2){
  var sources = [];
  if (x1 && x2) {
    ByRange = crossVariation.dimension(function(d) { return d.startaa; });
    ByRange.filter([x1, x2])
    ByRange.top(Infinity).forEach(function(d, i){
      sources.push(
        {source:{x:xScale(d.endaa), y: 11, type:d.type, id:d.id },
        sourceStart:{x:xScale(d.startaa), y: 11, type:d.type, id:d.id},
        sourceEnda:{x:xScale(d.endaa + 1), y: 11, type:d.type, id:d.id}
      })
    })
    // for (i; i <= x2; i++) {
    //   count = Variation.findAllByAttribute("endaa", i);
    //   if(count.length > 0){
    //     for (var t = 0; t < count.length; t++) {
    //       sources.push(
    //         {source:{x:xScale(count[t].endaa), y: 11, type:count[t].type, id:count[t].id },
    //         sourceStart:{x:xScale(count[t].startaa), y: 11, type:count[t].type, id:count[t].id},
    //         sourceEnda:{x:xScale(count[t].endaa + 1), y: 11, type:count[t].type, id:count[t].id}
    //       })
    //     }
    //   }
    // } 
  } else{
    var variations = Variation.all();
    for (var i = 0; i < variations.length; i++) {
      sources.push({
        source:{startaa:variations[i].startaa,endaa:variations[i].endaa, y: 11, type:variations[i].type, id:variations[i].id},
        sourceStart:{x:xScale(variations[i].startaa), y: 11, type:variations[i].type, id:variations[i].id},
        sourceEnda:{x:xScale(variations[i].endaa + 1), y: 11, type:variations[i].type, id:variations[i].id}
      })
    };
  }
  crossSources.add(sources);
  // console.log("sources: " + crossSources.size())
}


function makeArrayLinks(){
  var links = []
  allSources = crossSources.dimension(function(d) { return d.endaa; });
  allSources.groupAll()
  allSources.top(Infinity).forEach(function(d, i){
    for (var intcount = 0; intcount < targets.length; intcount++) {
      if(d.sourceStart.type == targets[intcount].target.type){
        var targetx = getRandomArbitrary(targets[intcount].target.minValue, targets[intcount].target.maxValue);
        links.push({start:{
            source:{x:d.sourceStart.x, y:d.sourceStart.y},
            target:{x:targetx,y:targets[intcount].target.y}
          },
          end:{
            target:{x:d.sourceEnda.x, y:d.sourceEnda.y},
            source:{x:targetx +1,y:targets[intcount].target.y}
          },
          linkData:{
            id:d.source.id,
            color:targets[intcount].target.color,
            type:targets[intcount].target.type,
          },
          startaa:d.source.startaa
        })
        // Save color on variation
        var currentvariation = Variation.find(d.source.id);
        currentvariation.color = targets[intcount].target.color;
        currentvariation.save();
      }
    }
  })
  crossLinks.add(links);
  // console.log("links: " + crossLinks.size())
}


//
function makeRank(first,last){
  var rank = [];
  for (var i = first; i <= last; i++) {
    rank.push(i)
  }
  return rank
}

var currentWidth = parseInt(d3.select('#chart').style('width'));

var	margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = currentWidth,
  height = 400- margin.top - margin.bottom,
  width2 = 600 - margin.left - margin.right,
  height2 = 500 - margin.top - margin.bottom;

var colors = ["4de242", "1b74ce", "e53e3e", "00a9ac", "c6e541", "ff800d", "2935cc", "991010", "ffcf2d"]

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

  currentVariableWidth = width / variableArray.length

  var variablePart = canvas.append("g").attr("class","variablePart")
  variableArray.forEach(function(d,i){
    variablePart.append("rect")
          .attr("id", function (d){ return "variable" + i })
          .attr("class", "variableContainer")
          .attr("width",function (d){ return width / variableArray.length })
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
    typesPart.append("text")
          .attr("width",function (d){ return i * ( width  / typeLength ) + (( width  / typeLength )/2)  })
          .attr("height", 15)
          .attr("y", height + 30)
          .attr("x",function (d) { return variableTypeArray[i]})
          .text(function () {return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, ' ');})
          .style("font-size",12)
  })
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
    var currentVariation = Variation.find(this.id)
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
function drawLinks(allLinks){
  var linksContainer = canvas.append("g").attr("class","linksContainer")

  // allLinks.top(Infinity).forEach(function(d){console.log(d)})

  var diagonal = d3.svg.diagonal()
          .source(function(d) { return {"x":d.source.x, "y":d.source.y}; })
          .target(function(d) { return {"x":d.target.x, "y":d.target.y};})
          .projection(function(d) { return [d.x, d.y]; })

  var links = allLinks.top(Infinity)
  // console.log(links)

  var refresh = function(){
    // console.log("link len " + links.length)
    var paths = linksContainer.selectAll("path")
        .data(links);

    paths.enter().append("path")

    paths.attr("id",function(v){ return v.linkData.id })
      .attr("class", function(v){ return "type" + v.linkData.color + " link " +"k"+ v.linkData.id })
      .classed( function(v){ return v.linkData.type} )
      .style("fill",function(v){ return "#" + v.linkData.color })
      .attr("d", function(v,i) { 
             return diagonal(v.end) + diagonal(v.start).replace(/^M/, 'L') + 'Z'   
          })
      .on("mouseover", function(v) {
              d3.selectAll('.link')
                .classed("hoverDesactive", true)
              d3.select(this)
                .classed("hoverActive", true)

              var currentVariation = Variation.find(v.linkData.id)
              // console.log(currentVariation)

                var xPosition = mouse.x;
                var yPosition = mouse.y ;

                //Update the tooltip position and value
                d3.select("#tooltip-variation")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");

                d3.select("#variationname")
                  .text(currentVariation.variationname);

                d3.select("#type")
                  .text(currentVariation.type);

                d3.select("#position")
                  .text(currentVariation.startaa + "-" + currentVariation.endaa);

                d3.select("#codon")
                  .text(currentVariation.codon);

                d3.select("#residues")
                  .text(currentVariation.alternativeresidues);

                d3.select("#allelles")
                  .text(currentVariation.allelles);

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

  }

  refresh();

  return {refresh: refresh};

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
      

  })

}

// ---------------------- Exon Code ---------------------- //

function renderExon(){
  var currentElement = d3.select(".exonChart").transition().duration(500).attr("width", 0).remove()
  allExons = Exon.all()
  drownExonChart();
  drowExonData(allExons)
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
                    .attr("class","exonData")
                    .attr("x1",function(d){ return xScale(d.startaa) })
                    .attr("x2", function(d){ return xScale(d.endaa) })
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
                        var yPosition = mouse.y -80;

                        //Update the tooltip position and value
                        d3.select("#tooltip-exon")
                          .style("left", xPosition + "px")
                          .style("top", yPosition + "px");

                        d3.select("#exonid")
                          .text(currentExon.exonid);

                        d3.select("#positionExon")
                          .text(d.startaa + "-" + d.endaa);

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

// Save data on Anotation
function saveRecordToAnotation(type,id){

  if (type == "variation"){
    var currentvariation = Variation.find(id);

    var anotation = Anotation.create({
      data_id: id,
      type: "variation",
      data: currentvariation,
    })

    anotation.save();

  }
}











module.exports = init;
