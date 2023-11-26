import { Map } from "./model/map.js";
import { BestFirstSearcher } from "./search/best-first-search.js";
import { State } from "./search/utilities.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";
let mapCount;
let currentMapId;
let map;
let mapView;
const mapDropdown = new Dropdown("#map-dropdown");
function loadMap(mapId) {
    console.log(`Loading map ${mapId}...`);
    fetch(`/maps/${mapId}`).then((response) => response.text()).then((mapString) => {
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
    fetch(`/maps/${mapId}`, { method: "PUT", body: mapString }).then(() => console.log(`Saved map ${mapId}`));
}
function createMap(height, width) {
    if (!height || !width || 1 > height || 1 > width)
        console.log("Map dimensions must be positive");
    // Create a new blank map string
    let mapString = (' '.repeat(width - 1) + "E\n"); // Exit in top-right corner
    mapString += (' '.repeat(width) + '\n').repeat(height - 2);
    mapString += 'P' + ' '.repeat(width - 1);
    mapCount++;
    currentMapId = mapCount;
    console.log(`Creating new map ${currentMapId}...`);
    console.log(mapString);
    // Create the new map
    map = new Map(mapString);
    mapView = new MapView(map);
    mapDropdown.addOption(`Map ${currentMapId}`);
    console.log(`Map count: ${mapCount}`);
    mapDropdown.setSelection(mapCount - 1);
    // Save and load the map
    saveMap(currentMapId);
    loadMap(currentMapId);
    console.log(`Created new map ${currentMapId}`);
}
function search() {
    const playerRowColumn = map.player.cell.position;
    const initialState = new State(map.toXY(playerRowColumn));
    console.log("Searching...");
    (new BestFirstSearcher(map, mapView)).search(initialState).then((path) => {
        if (0 === path.length) {
            console.log("Failed to find solution path");
        }
        else {
            console.log("Found solution path");
            console.log(path);
        }
    });
}
fetch("/maps").then((response) => response.json()).then((maps) => {
    maps.forEach((map) => mapDropdown.addOption(map));
    mapCount = maps.length;
});
// Set up the map loading
$("#load-button").on("click", () => {
    loadMap(mapDropdown.selection + 1);
});
// Set up the map saving
$("#save-button").on("click", () => {
    saveMap(currentMapId);
});
// Set up the map creation
$("#create-button").on("click", () => {
    const height = $("#height-input").val();
    const width = $("#width-input").val();
    createMap(height, width);
});
// Set up the searching
$("#search-button").on("click", () => {
    search();
});
// Set up display resetting
$("#reset-button").on("click", () => {
    mapView.reset();
});
loadMap(1);
