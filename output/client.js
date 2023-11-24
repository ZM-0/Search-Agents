import { Map } from "./model/map.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";
let map;
let mapView;
const mapDropdown = new Dropdown("#map-dropdown");
function loadMap(mapId) {
    console.log(`Loading map ${mapId}...`);
    fetch(`/maps/${mapId}`)
        .then((response) => response.text())
        .then((mapString) => {
        console.log(mapString);
        if (mapView)
            mapView.destroy();
        map = new Map(mapString);
        mapView = new MapView(map);
        console.log(`Loaded map ${mapId}`);
    });
}
fetch("/maps")
    .then((response) => response.json())
    .then((maps) => {
    // Set up the map dropdown
    maps.forEach((map) => mapDropdown.addOption(map));
    // Set up the map loading
    $("#load-button").on("click", () => {
        loadMap(mapDropdown.selection + 1);
    });
});
loadMap(1);
