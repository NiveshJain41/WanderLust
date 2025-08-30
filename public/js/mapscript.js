document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("map")) {
    let map_token = map_api;
    maptilersdk.config.apiKey = map_token;

    const map = new maptilersdk.Map({
      container: "map",
      style: maptilersdk.MapStyle.STREETS,
      center: coordinates, // e.g. [77.2090, 28.6139]
      zoom: 14,
    });

    // 📍 Add marker INSIDE the map scope
    new maptilersdk.Marker({ color: "red" })
      .setLngLat(coordinates)
      .addTo(map);
  }
});
