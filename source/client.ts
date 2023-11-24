import { Map } from "./model/map.js";
import { MapView } from "./view/map-view.js";


fetch("/maps")
    .then((response: Response) => response.json())
    .then(console.log);

fetch("/maps/1")
    .then((response: Response) => response.text())
    .then((mapString: string) => {
        console.log(mapString);
        const map: Map = new Map(mapString);
        const mapView: MapView = new MapView(map);
    });