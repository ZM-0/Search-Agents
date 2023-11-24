import { Map } from "./model/map.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";
let currentMapId;
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
        currentMapId = mapId;
        map = new Map(mapString);
        mapView = new MapView(map);
        console.log(`Loaded map ${mapId}`);
    });
}
function saveMap(mapId) {
    console.log(`Saving map ${mapId}...`);
    const mapString = map.toString();
    console.log(mapString);
    fetch(`/maps/${mapId}`, { method: "PUT", body: mapString })
        .then(() => console.log(`Saved map ${mapId}`));
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
    // Set up the map saving
    $("#save-button").on("click", () => {
        saveMap(currentMapId);
    });
});
loadMap(1);
