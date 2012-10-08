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
    }).error(function() {
      alert("error");
    });
}

function parseResponse(data) {
  console.log(data);

  // get iteration interval
  startDate = parseDateString(data.getElementsByTagName("start")[0].textContent);
  endDate = parseDateString(data.getElementsByTagName("finish")[0].textContent);
  currentDate = new Date();
  $(".iteration").append(startDate.toLocaleString() + " ");
  $(".iteration").append(endDate.toLocaleString());

  // number of days
  numberOfDays = daysBetween(startDate, endDate);
  console.log("number of days: " + numberOfDays);

  // chart data
  var totalStoryPoints = 0;
  var acceptedStories = [];
  chartData = new google.visualization.DataTable();
  chartData.addColumn('date', 'Day of the week');
  chartData.addColumn('number', 'Actual');
  chartData.addColumn('number', 'Ideal');
  chartData.addRows(numberOfDays);

  // determine the number of accepted stories
  story = $("story", data);
  console.log(story);
  for (i = 0; i < story.length; i++) {
    estimate = parseInt($("estimate", story[i])[0].textContent);
    console.log(estimate);

    totalStoryPoints += estimate;
    console.log("total story points: " + totalStoryPoints);

    acceptedInfo = $("accepted_at", story[i]);
    if (acceptedInfo.length > 0) {
      date = parseDateString(acceptedInfo[0].textContent);
      console.log("accepted on: " + date.toLocaleString());
      acceptedStories.push([date, estimate]);
    }
  }

  chartData.setCell(0, 0, startDate);
  chartData.setCell(0, 2, 0);
  chartData.setCell(1, 0, endDate);
  chartData.setCell(1, 2, totalStoryPoints);

  chartData.setCell(0, 1, 0);

  for (i = 0; i < acceptedStories.length; i++) {
    chartData.setCell(i, 0, acceptedStories[i][0]);
    chartData.setCell(i, 1, acceptedStories[i][1]);
  }

  var options = {
    title: 'Burn up'
  };

  // chart
  var chart = new google.visualization.LineChart($(".chart")[0]);
  chart.draw(chartData, options);
}

