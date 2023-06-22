var map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  var depths = [-10, 10, 30, 50, 70, 90];
  var labels = [];

  for (var i = 0; i < depths.length; i++) {
    var from = depths[i];
    var to = depths[i + 1];

    labels.push(
      '<i style="background:' + getColorByDepth(from + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px;"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }

  div.innerHTML = labels.join("<br>");

  div.style.backgroundColor = "white";
  div.style.padding = "10px";
  div.style.border = "1px solid black";

  return div;
};

legend.addTo(map);

function getMarkerSize(magnitude) {
  return magnitude * 4;
}

function getColorByDepth(depth) {
  if (depth < 10) {
    return 'lightgreen';
  } else if (depth < 30) {
    return 'green';
  } else if (depth < 50) {
    return 'yellow';
  } else if (depth < 70) {
    return 'orange';
  } else if (depth < 90) {
    return 'darkorange';
  } else {
    return 'red';
  }
}

fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.features.forEach(function (earthquake) {
      var magnitude = earthquake.properties.mag;
      var depth = earthquake.geometry.coordinates[2];
      var location = earthquake.properties.place;
      var markerSize = getMarkerSize(magnitude);
      var markerColor = getColorByDepth(depth);

      var circleMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });

      var popupContent =
        "<b>Magnitude:</b> " + magnitude +
        "<br><b>Depth:</b> " + depth + " km" +
        "<br><b>Location:</b> " + location; 
      circleMarker.bindPopup(popupContent);
      circleMarker.addTo(map);
    });
  });
  