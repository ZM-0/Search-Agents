import { Action } from "./model/action.js";
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
    private readonly mapNames: string[];


    /**
     * The IDs of all the maps.
     */
    private readonly mapIDs: number[];


    /**
     * The index of all the maps that is currently loaded.
     */
    private currentIndex: number;


    /**
     * The currently loaded map.
     */
    private map!: Map;


    /**
     * The display for the currently loaded map.
     */
    private mapView!: MapView;


    /**
     * Creates a new manager for some maps and loads the first map.
     * @param names A list of the map names in the form "Map <ID>".
     */
    constructor(names: string[]) {
        this.mapNames = names;
        this.mapIDs = names.map((name: string) => parseInt(name.slice(4)));
        this.currentIndex = 0;
        this.loadMap(this.mapIDs[this.currentIndex]);
    }


    /**
     * Gets the index of the map with the given ID.
     * @param mapID The map ID.
     * @returns The map index.
     */
    public getIndex(mapID: number): number {
        return this.mapIDs.findIndex((currentID: number) => currentID === mapID);
    }


    /**
     * Gets the ID of the map with the given index.
     * @param mapIndex The map index.
     * @returns The map ID.
     */
    public getID(mapIndex: number): number {
        return this.mapIDs[mapIndex];
    }


    /**
     * Gets the current map.
     * @returns The current map.
     */
    public getMap(): Map {
        return this.map;
    }


    /**
     * Gets the map view.
     * @returns The map view.
     */
    public getMapView(): MapView {
        return this.mapView;
    }


    /**
     * Fetches, loads, and displays a map.
     * @param mapID The ID of the map to load.
     */
    public loadMap(mapID: number): void {
        console.log(`Loading map ${mapID}...`);

        fetch(`/maps/${mapID}`).then(
            (response: Response) => response.text()
        ).then((mapString: string) => {        
            if (this.mapView) this.mapView.destroy();   // Destroy any existing map view
            
            this.currentIndex = this.getIndex(mapID);
            this.map = new Map(mapString);
            this.mapView = new MapView(this.map);
            mapDropdown.selection = this.currentIndex;

            console.log(`Loaded map ${mapID}`);
        }).catch(
            () => console.log(`Failed to find map ${mapID}`)
        );
    }


    /**
     * Saves the current map.
     */
    public saveMap(): void {
        console.log(`Saving map ${this.mapIDs[this.currentIndex]}...`);

        fetch(
            `/maps/${this.mapIDs[this.currentIndex]}`,
            {method: "PUT", body: this.map.toString()}
        ).then(
            () => console.log(`Saved map ${this.mapIDs[this.currentIndex]}`)
        ).catch(
            () => console.log(`Failed to save map ${this.mapIDs[this.currentIndex]}`)
        );
    }


    /**
     * Creates a new default map with the exit in the top-right and the player in the bototm-left.
     * @param height The map height in cells.
     * @param width The map width in cells.
     */
    public createMap(height: number, width: number): void {
        if (!height || !width || 1 > height || 1 > width) throw new Error("Map dimensions must be provided and positive");
        
        // Create a new default map string
        const mapString: string = (
            (' '.repeat(width - 1) + "E\n") +
            (' '.repeat(width) + '\n').repeat(height - 2) +
            'P' + ' '.repeat(width - 1)
        );
        
        // Register the new map with the manager
        const mapID: number = this.mapIDs.at(-1)! + 1;
        const mapName: string = `Map ${mapID}`;
        this.mapIDs.push(mapID);
        this.mapNames.push(mapName);

        console.log(`Creating new map ${mapID}...`);

        // Create the new map
        this.map = new Map(mapString);
        this.mapView = new MapView(this.map);
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
    public deleteMap(mapID: number): void {
        console.log(`Deleting map ${mapID}...`);

        // Remove the map from the server
        fetch(`/maps/${mapID}`, {method: "DELETE"}).then(() => {
            // Remove the map from the map manager
            const mapIndex: number = this.getIndex(mapID);
            this.mapNames.splice(mapIndex, 1);
            this.mapIDs.splice(mapIndex, 1);

            if (mapIndex === this.currentIndex) {
                this.currentIndex %= this.mapIDs.length;
                this.loadMap(this.getID(this.currentIndex));
            } else if (mapIndex < this.currentIndex) {
                this.currentIndex--;
            }
    
            mapDropdown.selection = this.currentIndex;
            console.log(`Deleted map ${mapID}`);
        }).catch(
            () => console.log(`Failed to delete map ${mapID}`)
        );
        
    }
}


let mapManager: MapManager;
let mapDropdown: Dropdown;


fetch("/maps").then(
    (response: Response) => response.json()
).then((maps: string[]) => {
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
    const height: number = $("#height-input").val() as number;
    const width: number = $("#width-input").val() as number;
    mapManager.createMap(height, width);
});


// Set up map deleting
$("#delete-button").on("click", () => {
    mapManager.deleteMap(mapManager.getID(mapDropdown.selection));
});


// Set up the searching
$("#search-button").on("click", () => {
    const map: Map = mapManager.getMap();
    const mapView: MapView = mapManager.getMapView();
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
});


// Set up display resetting
$("#reset-button").on("click", () => {
    mapManager.getMapView().reset();
});