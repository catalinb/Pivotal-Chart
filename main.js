// TODO: use an external file for login credentials
var token = "d295943c69609f13a8ab03d6f2e22a87";
var project_id = "646863";
var base_url = "http://www.pivotaltracker.com/services/v3/projects/"

$(function() {
  // get token
  update();
});

function update() {
  // get current iteration
  $.ajax({
    url : base_url + project_id + "/iterations",
    crossDomain : true,
    dataType : "xml",
    headers : {
      "X-TrackerToken" : token
    }}).success(function(data, textStatus, jqXHR) {
      alert("success: " + data);
    }).error(function() {
      alert("error");
    });
}
