import { Map } from "./model/map.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";


fetch("/maps")
    .then((response: Response) => response.json())
    .then((maps: string[]) => {
        console.log(maps);
        const mapDropdown: Dropdown = new Dropdown("#map-dropdown");
        maps.forEach((map: string) => mapDropdown.addOption(map));
    });

fetch("/maps/1")
    .then((response: Response) => response.text())
    .then((mapString: string) => {
        console.log(mapString);
        const map: Map = new Map(mapString);
        const mapView: MapView = new MapView(map);
    });