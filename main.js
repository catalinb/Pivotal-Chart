
// TODO: use an external file for login credentials
var token = "token";
var project_id = "project_id";
var base_url = "http://www.pivotaltracker.com/services/v3/projects/";

// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']}, update);
google.setOnLoadCallback(update);

function update() {
  // get current iteration:
  $.ajax({
    url : base_url + project_id + "/iterations/current",
    crossDomain : true,
    dataType : "xml",
    headers : {
      "X-TrackerToken" : token
    }}).success(function(data, textStatus, jqXHR) {
      parseResponse(data);
      debug(data);
    }).error(function() {
      alert("error");
    });
}

var globalData = {}
function parseResponse(data) {
  console.log(data);
  globalData = data;

  // get iteration interval
  startDate = data.getElementsByTagName("start")[0];
  endDate = data.getElementsByTagName("finish")[0];
  console.log(startDate);
  $(".iteration").append(startDate.textContent);
  $(".iteration").append(endDate.textContent);
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


