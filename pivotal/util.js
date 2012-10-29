// utility functions
function parseDateString(date) {
  date = date.split(/\s/g);

  date = new Date(date[0]);
  date.setTime(date.valueOf() + 3 * 3600000); // apply timezone correction
  return date;
}

function replicate (n, x) {
  var xs = [];
  for (var i = 0; i < n; ++i) {
    xs.push (x);
  }
  return xs;
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

function daysBetween(startDate, endDate) {
  return (endDate - startDate) / (1000 * 24 * 60 * 60);
}
