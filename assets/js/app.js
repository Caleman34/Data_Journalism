var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// create variables for default graph axis setting
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
var radius = 8

// function used for updating x-scale var upon click on axis label
function xScale(demData, chosenXAxis) {
  // create scales on the x-axis
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demData, d => d[chosenXAxis] * 0.8), d3.max(demData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
};

// function used for updating y-scale var upon click on axis label
function yScale(demData, chosenyAxis) {
  // create scales on the x-axis
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(demData, d => d[chosenYAxis] * 0.8), d3.max(demData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);
  return yLinearScale;
};

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
};

// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
};

// function to create circles that change based on chosen axis
function renderCircles(circlesGroup, newXScale, newYscale, chosenXAxis, chesenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
};

// function for lables to go inside cirsles on graph
function renderLabels(labelsGroup, newXScale, newYscale, chosenXAxis, chesenYAxis) {
  labelsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]) + radius / 3);
  return circlesGroup;
};

// function for updating circles with new tooltip
function updateToolTip(chosenXAxis, chosenYaxis, labelsGroup) {
  var xLabel;
  var yLabel;

  // X Axis cases
  switch (chesenXAxis) {
    case "poverty": xLabel = "Poverty (%)";
      break;
    case "age": xLabel = "Age (Median)";
      break;
    case "income": xLabel = "Median Household Income";
      break;
  }  
  
  // Y Axis cases
  switch (chesenYAxis) {
    case "healthcare": yLabel = "Lacks Healthcare (%)";
      break;
    case "smokes": yLabel = "Smokes (%)";
      break;
    case "obesity": yLabel = "Obesity (%)";
      break;
    }

  // toolip
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`)
      });
  // declare handlers
  labelsGroup.call(toolTip);
  labelsGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
    retuen labelsGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(demData, err) {
  if (err) throw err;

  // parse data
  demData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });