/* eslint-disable*/

console.log('Client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGV2anVtYSIsImEiOiJjbGVkOHcyMTcwNG1nM3BtdmR2NXhldmk0In0.E1BsbSWhQ-2BrqZzZ-hDYw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/devjuma/cled957nk000u01pgl0yovmej',
  scrollZooom: false,
  // center: [-118.113491, 34.11745],
  // zoom: 4,
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // CREATE MARKER
  const el = document.createElement('div');
  //ADD MARKER
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Daty ${loc.day}: ${loc.description}</p>`);
  //EXTEND BOUNDS TO INCLUDE CURRENT LOCATION
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
