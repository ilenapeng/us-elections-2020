mapboxgl.accessToken = 'pk.eyJ1IjoiaWxlbmFwIiwiYSI6ImNsM3Voejg3ODAxMzUzZHFoN2Z5djM2c2oifQ.hXvLCq-QwU9JZ8hBGIDa4Q';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ilenap/cl3ugzb5j002b14pnkv0osy04',
    // the default zoom he gave us was 6.5, zooms directly in on Kentucky
    zoom: 3.5,
    maxZoom: 9,
    minZoom: 3,
    // the point he gave was -85.5, 37.7 for zooming in on Kentucky
    center: [-98.5795, 37.2283]
});

// .on "load" adds the layer AFTER the base map loads
// Colors our states gray:
// map.on("load", function () {
//     map.addLayer({
//       id: "us_states_elections",
//       type: "fill", 
//     //   this is a polygon layer - in Mapbox GL language, it's called a fill layer
//       source: {
//         type: "geojson",
//         data: "data/statesElections.geojson",
//       },
//       paint: {
//         "fill-color": "#cccccc",
//         "fill-outline-color": "#000000",
//       },
//     });
//   });

// Gives us our choropleth:
map.on("load", function () {
    // print the list of the layers being loaded, so we know where to put our layers
    // let layers = map.getStyle().layers;
    //     for (var i=0; i<layers.length; i++) {
    //     console.log(layers[i].id)}

    map.addLayer(
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
      "waterway-label" // Here's where we tell Mapbox where to slot this new layer
    ); 
    map.addLayer(
      {
        id: "us_states_elections",
        type: "fill",
        maxzoom: 6,
        source: {
          type: "geojson",
          data: "data/statesElections.geojson",
        },
        paint: {
          "fill-color": [
            "match",
            ["get", "Winner"],
            "Donald J Trump", "#cf635d",
            "Joseph R Biden Jr", "#6193c7",
            "Other", "#91b66e",
            "#ffffff",
          ],
          "fill-outline-color": "#ffffff",
        //  Adds opacity based on data
          "fill-opacity": [
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
      },
     "us_states_elections_outline" // Here's where we tell Mapbox where to slot this new layer
    );

    // Add county level data
    map.addLayer(
        {
          id: "us_counties_elections_outline",
          type: "line",
          source: {
            type: "geojson",
            data: "data/countiesElections.geojson",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": 0.25,
          },
        },
        "us_states_elections"
      );
      map.addLayer(
        {
          id: "us_counties_elections",
          type: "fill",
          minzoom: 6,
          source: {
            type: "geojson",
            data: "data/countiesElections.geojson",
          },
          paint: {
            "fill-color": [
              "match",
              ["get", "Winner"],
            //   this is matching, so if it's Donald J Trump, use the hex code #cf635d
              "Donald J Trump", "#cf635d",
              "Joseph R Biden Jr", "#6193c7",
              "Other", "#91b66e",
              "#ffffff",
            ],
            "fill-outline-color": "#000000",
            "fill-opacity": [
              "step",
              ["get", "WnrPerc"],
            //   if it's from 0-0.3, then opacity is 0.4
              0.3,
              0.4,
            //   if it's from 0.3-0.4, the opacity is 0.5
              0.5,
              0.5,
              0.7,
              0.6,
              0.9,
            ],
          },
        },
        "us_counties_elections_outline"
      );

      // text for legend
        const layers = [
          'Trump',
          'Biden',
          // 'Other'
        ];
        const colors = [
          '#cf635d',
          '#6193c7',
          // '#91b66e'
        ];
      
      // create legend
      const legend = document.getElementById('legend');

      layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });

  });

// Create the popup
map.on('click', 'us_states_elections', function (e) {
    var stateName = e.features[0].properties.State;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>'+stateName+'</h4>'
            +'<h2>'+winner+'</h2>'
            + '<p>'+wnrPerc+'% - ('+totalVotes+' votes)</p>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the us_states_elections layer.
map.on('mouseenter', 'us_states_elections', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'us_states_elections', function () {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'us_counties_elections', function (e) {
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
        .addTo(map);
});
map.on('mouseenter', 'us_counties_elections', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'us_counties_elections', function () {
    map.getCanvas().style.cursor = '';
});