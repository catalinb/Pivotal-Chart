// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']}, update);
google.setOnLoadCallback(update);

function update() {
  // get current iteration:
  $.ajax({
    url : config.baseURL + config.project + "/iterations/current",
    crossDomain : true,
    dataType : "xml",
    headers : {
      "X-TrackerToken" : config.token
    }}).success(function(data, textStatus, jqXHR) {
      parseResponse(data);
      debug(data);
    }).error(function() {
      alert("error");
    });
}

var globalStartDate = {};
var globalEndDate = {};
function parseResponse(data) {
  console.log(data);

  // get iteration interval
  startDate = parseDateString(data.getElementsByTagName("start")[0].textContent);
  endDate = parseDateString(data.getElementsByTagName("finish")[0].textContent);
  globalStartDate = startDate;
  globalEndDate = endDate;
  $(".iteration").append(startDate.toLocaleString() + " ");
  $(".iteration").append(endDate.toLocaleString());

  // number of days
  numberOfDays = (endDate - startDate) / (1000 * 24 * 60 * 60);
  console.log("number of days: " + numberOfDays);

  // chart data
  chartData = new google.visualization.DataTable();
  chartData.addColumn('date', 'Day of the week');
  chartData.addColumn('number', 'Actual progress');
  chartData.addColumn('number', 'Ideal progress');
  chartData.addRows([
    [startDate, 0, 0],
    [startDate, 0, 0],
    [endDate, 12, 25]
  ]);

  var options = {
    title: 'Burn up'
  };

  // chart
  var chart = new google.visualization.LineChart($(".chart")[0]);
  chart.draw(chartData, options);
}

// utility functions
function parseDateString(date) {
  date = date.split(/\s/g);
  return new Date(date[0] + " " + date[1]);
}

function replicate (n, x) {
  var xs = [];
  for (var i = 0; i < n; ++i) {
    xs.push (x);
  }
  return xs;
}

function debug(data) {
      var response = xml_to_string(data);
      response = response.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      $("#debug").append(response);
}

function xml_to_string(xml_node) {
  if (xml_node.xml)
    return xml_node.xml;
  else if (XMLSerializer) {
    var xml_serializer = new XMLSerializer();
    return xml_serializer.serializeToString(xml_node);
  } else {
    alert("ERROR: Extremely old browser");
    return "";
  }
}


