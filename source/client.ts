import { Action } from "./model/action.js";
import { Map } from "./model/map.js";
import { BestFirstSearcher } from "./search/best-first-search.js";
import { State } from "./search/utilities.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";


let mapCount: number;
let currentMapId: number | string;
let map: Map;
let mapView: MapView;
const mapDropdown: Dropdown = new Dropdown("#map-dropdown");


function loadMap(mapId: number | string): void {
    console.log(`Loading map ${mapId}...`);

    fetch(`/maps/${mapId}`).then(
        (response: Response) => response.text()
    ).then((mapString: string) => {
        console.log(mapString);

        if (mapView) mapView.destroy();

        currentMapId = mapId;
        map = new Map(mapString);
        mapView = new MapView(map);

        console.log(`Loaded map ${mapId}`);
    });
}


function saveMap(mapId: number | string): void {
    console.log(`Saving map ${mapId}...`);

    const mapString: string = map.toString();
    console.log(mapString);

    fetch(`/maps/${mapId}`, {method: "PUT", body: mapString}).then(
        () => console.log(`Saved map ${mapId}`)
    );
}


function createMap(height: number, width: number): void {
    if (!height || !width || 1 > height || 1 > width) console.log("Map dimensions must be positive");

    // Create a new blank map string
    let mapString: string = (' '.repeat(width - 1) + "E\n");    // Exit in top-right corner
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


function deleteMap(mapId: number | string): void {
    console.log(`Deleting map ${mapId}...`);
    fetch(`/maps/${mapId}`, {method: "DELETE"}).then(
        () => console.log(`Deleted map ${mapId}`)
    );
}


function search(): void {
    const playerRowColumn: [number, number] = map.player.cell.position;
    const initialState: State = new State(map.toXY(playerRowColumn));

    console.log("Searching...");

    (new BestFirstSearcher(map, mapView)).search(initialState).then((path: Action[]) => {
        if (0 === path.length) {
            console.log("Failed to find solution path");
        } else {
            console.log("Found solution path");
            console.log(path);
        }
    });
}


fetch("/maps").then(
    (response: Response) => response.json()
).then((maps: string[]) => {
    maps.forEach((map: string) => mapDropdown.addOption(map));
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
    const height: number = $("#height-input").val() as number;
    const width: number = $("#width-input").val() as number;
    createMap(height, width);
});


// Set up map deleting
$("#delete-button").on("click", () => {
    deleteMap(currentMapId);
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