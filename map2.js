mapboxgl.accessToken = 'pk.eyJ1IjoiaWxlbmFwIiwiYSI6ImNsM3Voejg3ODAxMzUzZHFoN2Z5djM2c2oifQ.hXvLCq-QwU9JZ8hBGIDa4Q';
var map2 = new mapboxgl.Map({
    container: 'map2',
    style: 'mapbox://styles/ilenap/cl3ugzb5j002b14pnkv0osy04',
    // the default zoom he gave us was 6.5, zooms directly in on Kentucky
    zoom: 3.5,
    maxZoom: 9,
    minZoom: 3,
    // the point he gave was -85.5, 37.7 for zooming in on Kentucky
    center: [-98.5795, 37.2283],
    maxBounds: [
      [-180, 15],
      [-30, 72],
    ],
    projection: 'albers',
});

// Gives us our choropleth:
map2.on("load", function () {
  map2.addLayer(
    {
      id: "us_counties_centroids",
      type: "circle",
      source: {
        type: "geojson",
        data: "data/countiesPoints.geojson",
      },
      paint: {
        // fixed circles
        // "circle-radius": [
        //   "max",
        //   [
        //     "/",
        //     ["sqrt", ["abs", ["-", ["get", "Trump"], ["get", "Biden"]]]],
        //     40,
        //   ],
        //   1,
        // ],
        // adjusts circles to the size of the zoom
        'circle-radius':
        ['interpolate', ['linear'], ['zoom'],
            3, ['max', ['/', ['sqrt', ['abs', ['-', ['get', 'Trump'], ['get', 'Biden']]]], 40], 1],
            9, ['max', ['/', ['sqrt', ['abs', ['-', ['get', 'Trump'], ['get', 'Biden']]]], 15], 5],
        ],
        "circle-color": [
          "match",
          ["get", "Winner"],
          "Donald J Trump",
          "#cf635d",
          "Joseph R Biden Jr",
          "#6193c7",
          "Other",
          "#91b66e",
          "#ffffff",
        ],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 0.5,
        "circle-opacity": [
          "step",
          ["get", "WnrPerc"],
          0.3,
          0.4,
          0.5,
          0.5,
          0.7,
          0.6,
          0.9,
        ],
      },
      minzoom: 3,
    },
    "waterway-label"
  );
    map2.addLayer(
      {
      id: "us_states_elections_outline",
      type: "line",
      source: {
          type: "geojson",
          data: "data/statesElections.geojson",
      },
      paint: {
          "line-color": "#ffffff",
          "line-width": 0.7,
      },
      },
      "us_counties_centroids"
    );
    map2.addLayer(
      {
      id: "us_counties_elections_outline",
      type: "line",
      source: {
          type: "geojson",
          data: "data/countiesElections.geojson",
      },
      minzoom: 6,
      paint: {
          "line-color": "#ffffff",
          "line-width": 0.25,
      },
      },
      "us_states_elections_outline"
    );

      // text for legend
      const layers2 = [
        'Trump',
        'Biden',
        // 'Other'
      ];
      const colors2 = [
        '#cf635d',
        '#6193c7',
        // '#91b66e'
      ];
    
    // create legend
    const legend2 = document.getElementById('legend2');
  
    layers2.forEach((layer, i) => {
      const color2 = colors2[i];
      const item2 = document.createElement('div');
      const key2 = document.createElement('span');
      key2.className = 'legend-key2';
      key2.style.backgroundColor = color2;
  
      const value2 = document.createElement('span');
      value2.innerHTML = `${layer}`;
      item2.appendChild(key2);
      item2.appendChild(value2);
      legend2.appendChild(item2);
    });
  
});

// Create the popup
map2.on('click', 'us_counties_centroids', function (e) {
  var stateName = e.features[0].properties.State;
  var countyName = e.features[0].properties.County;
  var winner = e.features[0].properties.Winner;
  var wnrPerc = e.features[0].properties.WnrPerc;
  var totalVotes = e.features[0].properties.Total;
  wnrPerc = (wnrPerc * 100).toFixed(0);
  totalVotes = totalVotes.toLocaleString();
  stateName = stateName.toUpperCase();
  countyName = countyName.toUpperCase();
  new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h4>' + countyName + ' - ' + stateName + '</h4>'
          + '<h2>' + winner + '</h2>'
          + '<p>' + wnrPerc + '% - (' + totalVotes + ' votes)</p>')
      .addTo(map2);
});
map2.on('mouseenter', 'us_counties_centroids', function () {
  map2.getCanvas().style.cursor = 'pointer';
});
map2.on('mouseleave', 'us_counties_centroids', function () {
  map2.getCanvas().style.cursor = '';
});