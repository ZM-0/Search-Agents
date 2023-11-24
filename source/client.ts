import { Map } from "./model/map.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";


let map: Map;
let mapView: MapView;
const mapDropdown: Dropdown = new Dropdown("#map-dropdown");


function loadMap(mapId: number | string): void {
    console.log(`Loading map ${mapId}...`);
    fetch(`/maps/${mapId}`)
        .then((response: Response) => response.text())
        .then((mapString: string) => {
            console.log(mapString);
            if (mapView) mapView.destroy();
            map = new Map(mapString);
            mapView = new MapView(map);
            console.log(`Loaded map ${mapId}`);
        });
}


fetch("/maps")
    .then((response: Response) => response.json())
    .then((maps: string[]) => {
        // Set up the map dropdown
        maps.forEach((map: string) => mapDropdown.addOption(map));

        // Set up the map loading
        $("#load-button").on("click", () => {
            loadMap(mapDropdown.selection + 1);
        });
    });

loadMap(1);