import { Map } from "./model/map.js";
import { MapView } from "./view/map-view.js";
fetch("/maps")
    .then((response) => response.json())
    .then(console.log);
fetch("/maps/1")
    .then((response) => response.text())
    .then((mapString) => {
    console.log(mapString);
    const map = new Map(mapString);
    const mapView = new MapView(map);
});
