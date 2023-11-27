import { CellController } from "./controller/cell-controller.js";
import { MapController } from "./controller/map-controller.js";
import { Map } from "./model/map.js";
import { BestFirstSearcher } from "./search/best-first-search.js";
import { State } from "./search/utilities.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";
/**
 * Manages all the maps.
 */
class MapManager {
    /**
     * The names of all the maps in the form "Map <ID>".
     */
    mapNames;
    /**
     * The IDs of all the maps.
     */
    mapIDs;
    /**
     * The index of all the maps that is currently loaded.
     */
    currentIndex;
    /**
     * The currently loaded map.
     */
    map;
    /**
     * The display for the currently loaded map.
     */
    mapView;
    /**
     * The map controller.
     */
    mapController;
    /**
     * Indicates if the current map is shown as having unsaved changes.
     */
    changeFlag = false;
    /**
     * Creates a new manager for some maps and loads the first map.
     * @param names A list of the map names in the form "Map <ID>".
     */
    constructor(names) {
        this.mapNames = names;
        this.mapIDs = names.map((name) => parseInt(name.slice(4)));
        this.currentIndex = 0;
        this.loadMap(this.mapIDs[this.currentIndex]).then(() => {
            for (let i = 0; i < this.map.getHeight(); i++) {
                for (let j = 0; j < this.map.getWidth(); j++) {
                    this.mapController.getCellController(i, j).subscribe(this);
                }
            }
        });
    }
    update() {
        if (CellController.unsavedChanges && !this.changeFlag) {
            $("#current-map").text(`${$("#current-map").text()} *`);
            this.changeFlag = true;
        }
    }
    /**
     * Gets the index of the map with the given ID.
     * @param mapID The map ID.
     * @returns The map index.
     */
    getIndex(mapID) {
        return this.mapIDs.findIndex((currentID) => currentID === mapID);
    }
    /**
     * Gets the ID of the map with the given index.
     * @param mapIndex The map index.
     * @returns The map ID.
     */
    getID(mapIndex) {
        return this.mapIDs[mapIndex];
    }
    /**
     * Gets the current map.
     * @returns The current map.
     */
    getMap() {
        return this.map;
    }
    /**
     * Gets the map view.
     * @returns The map view.
     */
    getMapView() {
        return this.mapView;
    }
    /**
     * Fetches, loads, and displays a map.
     * @param mapID The ID of the map to load.
     */
    async loadMap(mapID) {
        console.log(`Loading map ${mapID}...`);
        return fetch(`/maps/${mapID}`).then((response) => response.text()).then((mapString) => {
            if (this.mapView)
                this.mapView.destroy(); // Destroy any existing map view
            this.currentIndex = this.getIndex(mapID);
            this.map = new Map(mapString);
            this.mapView = new MapView(this.map);
            this.mapController = new MapController(this.map, this.mapView);
            mapDropdown.selection = this.currentIndex;
            this.changeFlag = false;
            $("#current-map").text(`Current: ${this.mapNames[this.currentIndex]}`);
            console.log(`Loaded map ${mapID}`);
        }).catch(() => console.log(`Failed to find map ${mapID}`));
    }
    /**
     * Saves the current map.
     */
    saveMap() {
        console.log(`Saving map ${this.mapIDs[this.currentIndex]}...`);
        fetch(`/maps/${this.mapIDs[this.currentIndex]}`, { method: "PUT", body: this.map.toString() }).then(() => {
            CellController.unsavedChanges = false;
            this.changeFlag = false;
            $("#current-map").text(`Current: ${this.mapNames[this.currentIndex]}`);
            console.log(`Saved map ${this.mapIDs[this.currentIndex]}`);
        }).catch(() => console.log(`Failed to save map ${this.mapIDs[this.currentIndex]}`));
    }
    /**
     * Creates a new default map with the exit in the top-right and the player in the bototm-left.
     * @param height The map height in cells.
     * @param width The map width in cells.
     */
    createMap(height, width) {
        if (!height || !width || 1 > height || 1 > width)
            throw new Error("Map dimensions must be provided and positive");
        // Create a new default map string
        const mapString = ((' '.repeat(width - 1) + "E\n") +
            (' '.repeat(width) + '\n').repeat(height - 2) +
            'P' + ' '.repeat(width - 1));
        // Register the new map with the manager
        const mapID = this.mapIDs.at(-1) + 1;
        const mapName = `Map ${mapID}`;
        this.mapIDs.push(mapID);
        this.mapNames.push(mapName);
        console.log(`Creating new map ${mapID}...`);
        // Create the new map
        this.map = new Map(mapString);
        this.mapView = new MapView(this.map);
        this.mapController = new MapController(this.map, this.mapView);
        this.currentIndex = this.mapIDs.length - 1;
        // Register the new map with the dropdown
        mapDropdown.selection = this.currentIndex;
        // Save and load the map
        this.saveMap();
        this.loadMap(this.getID(this.currentIndex));
        console.log(`Created new map ${mapID}`);
    }
    /**
     * Deletes a map.
     * @param mapID The ID of the map to delete.
     */
    deleteMap(mapID) {
        console.log(`Deleting map ${mapID}...`);
        // Remove the map from the server
        fetch(`/maps/${mapID}`, { method: "DELETE" }).then(() => {
            // Remove the map from the map manager
            const mapIndex = this.getIndex(mapID);
            this.mapNames.splice(mapIndex, 1);
            this.mapIDs.splice(mapIndex, 1);
            if (mapIndex === this.currentIndex) {
                this.currentIndex %= this.mapIDs.length;
                this.loadMap(this.getID(this.currentIndex));
            }
            else if (mapIndex < this.currentIndex) {
                this.currentIndex--;
            }
            mapDropdown.selection = this.currentIndex;
            console.log(`Deleted map ${mapID}`);
        }).catch(() => console.log(`Failed to delete map ${mapID}`));
    }
}
let mapManager;
let mapDropdown;
fetch("/maps").then((response) => response.json()).then((maps) => {
    mapManager = new MapManager(maps);
    mapDropdown = new Dropdown("#map-dropdown", maps);
});
// Set up the map loading
$("#load-button").on("click", () => {
    mapManager.loadMap(mapManager.getID(mapDropdown.selection));
});
// Set up the map saving
$("#save-button").on("click", () => {
    mapManager.saveMap();
});
// Set up the map creation
$("#create-button").on("click", () => {
    const height = $("#height-input").val();
    const width = $("#width-input").val();
    mapManager.createMap(height, width);
});
// Set up map deleting
$("#delete-button").on("click", () => {
    mapManager.deleteMap(mapManager.getID(mapDropdown.selection));
});
// Set up the searching
$("#search-button").on("click", () => {
    const map = mapManager.getMap();
    const mapView = mapManager.getMapView();
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
});
// Set up display resetting
$("#reset-button").on("click", () => {
    mapManager.getMapView().reset();
});
