import { Map } from "./model/map.js";
import { Dropdown } from "./ui/dropdown.js";
import { MapView } from "./view/map-view.js";
fetch("/maps")
    .then((response) => response.json())
    .then((maps) => {
    console.log(maps);
    const mapDropdown = new Dropdown("#map-dropdown");
    maps.forEach((map) => mapDropdown.addOption(map));
});
fetch("/maps/1")
    .then((response) => response.text())
    .then((mapString) => {
    console.log(mapString);
    const map = new Map(mapString);
    const mapView = new MapView(map);
});
