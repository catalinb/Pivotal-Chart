// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages':['corechart']}, getIteration);
google.setOnLoadCallback(getIteration);

// refresh page
var lastRefreshTime = (new Date()).getTime();

function refresh() {
  timeLeft = config.refreshTime - Math.round(((new Date()).getTime() - lastRefreshTime) / 1000);
  if (timeLeft <= 0) {
    window.location.reload(true);
  }

  $("#messageHead")[0].innerHTML = "Refreshing in: ";
  $("#countdown")[0].innerHTML = timeLeft;
  $("#messageTail")[0].innerHTML = "seconds.";
  setTimeout(refresh, 1000);
}

setTimeout(refresh, 1500);

function getIteration() {
  // get current iteration:
  $.ajax({
    url : config.baseURL + config.project + "/iterations/current",
    crossDomain : true,
    dataType : "xml",
    headers : {
      "X-TrackerToken" : config.token
    }}).success(function(data, textStatus, jqXHR) {
      getVelocity(data);
    }).error(function() {
      alert("error");
    });
}

function getVelocity(currentIterationData) {
//http://www.pivotaltracker.com/services/v3/projects/$PROJECT_ID
  $.ajax({
    url : config.baseURL + config.project,
    crossDomain : true,
    dataType : "xml",
    headers : {
      "X-TrackerToken" : config.token
    }}).success(function(data, textStatus, jqXHR) {
      parseResponse(currentIterationData, data);
    }).error(function() {
      alert("error");
    });
}

function parseResponse(data, velocity) {
  console.log(data);

  // get iteration interval
  startDate = parseDateString(data.getElementsByTagName("start")[0].textContent);
  endDate = parseDateString(data.getElementsByTagName("finish")[0].textContent);
  currentDate = new Date();

  // chart data
  chartData = new google.visualization.DataTable();
  chartData.addColumn('date', 'Day of the week');
  chartData.addColumn('number', 'Ideal');
  chartData.addColumn('number', 'Expected');
  chartData.addColumn('number', 'Actual');

  var totalStoryPoints = 0;
  var totalAcceptedStoryPoints = 0;
  var velocity = parseInt($("current_velocity", velocity)[0].textContent);

  var acceptedStories = [];
  for (loopDate = new Date(startDate); loopDate.valueOf() < endDate.valueOf() + 86400000; loopDate.setTime(loopDate.valueOf() + 86400000)) {
    if (loopDate <= currentDate) {
      acceptedStories[new Date(loopDate)] = [0, 0, 0];
    } else {
      acceptedStories[new Date(loopDate)] = [0, 0, null];
    }
  }

  // determine the number of accepted stories
  story = $("story", data);
  console.log(story);
  for (i = 0; i < story.length; i++) {
    estimate = parseInt($("estimate", story[i])[0].textContent);
    totalStoryPoints += estimate;

    acceptedInfo = $("accepted_at", story[i]);
    if (acceptedInfo.length > 0) {
      date = parseDateString(acceptedInfo[0].textContent);
      acceptedStories[date][1] += estimate;
    }
  }

  for (loopDate = new Date(startDate), currentExpected = 0, currentActual = 0, currentIdeal = 0; loopDate.valueOf() < currentDate.valueOf() + 86400000; loopDate.setTime(loopDate.valueOf() + 86400000)) {
    if (loopDate <= currentDate) {
      currentActual += acceptedStories[loopDate][1];
    } else {
      currentActual = null;
    }
    chartData.addRows([[new Date(loopDate), currentIdeal, currentExpected, currentActual]]);
    currentIdeal += totalStoryPoints / daysBetween(startDate, endDate);
    currentExpected += velocity / daysBetween(startDate, endDate);
  }

  chartData.addRows([[endDate, totalStoryPoints, velocity, null]]);
  console.log("Config: " + config.project);

  var options = {
    title: config.title,
    lineWidth: 7,
    colors: ["#F3E2A9","85B6FF", "#0101DF"],
    hAxis: {title: 'Day'},
    vAxis: {title: 'Accepted points'}
  };

  // chart
  var chart = new google.visualization.LineChart($(".chart")[0]);
  chart.draw(chartData, options);
}

