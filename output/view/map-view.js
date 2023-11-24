import { CellView } from "./cell-view.js";
/**
 * Displays a map in the browser.
 */
export class MapView {
    /**
     * The gap between cells in pixels.
     */
    static GAP = 1;
    /**
     * The map being displayed.
     */
    map;
    /**
     * The edge length of each cell.
     */
    cellSize;
    /**
     * The displays for the cells.
     */
    cellViews = [];
    /**
     * Creates a new map display.
     * @param map The map to be displayed.
     */
    constructor(map) {
        this.map = map;
        $(".map-section").append(`<div class="map"></div>`);
        // Create the cell displays
        for (let i = 0; i < this.map.getHeight(); i++) {
            this.cellViews.push([]);
            for (let j = 0; j < this.map.getWidth(); j++) {
                this.cellViews[i].push(new CellView(this.map.getCell(i, j)));
            }
        }
        // Calculate the cell size
        this.cellSize = `min(
            calc(${$(".map-section").height() - MapView.GAP * (this.map.getHeight() - 1)}px / ${this.map.getHeight()}),
            calc(${$(".map-section").width() - MapView.GAP * (this.map.getWidth() - 1)}px / ${this.map.getWidth()})
        )`;
        $(".cell").css({ "height": this.cellSize, "width": this.cellSize });
        // Create and style the map element
        const cssHeight = `calc(${this.map.getHeight()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
        const cssWidth = `calc(${this.map.getWidth()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
        $(".map").css({
            "height": cssHeight,
            "width": cssWidth,
            "inset": `
                calc((${$(".map-section").height()}px - ${cssHeight}) / 2)
                calc((${$(".map-section").width()}px - ${cssWidth}) / 2)`,
            "grid-template-rows": `repeat(${this.map.getHeight()}, 1fr)`,
            "grid-template-columns": `repeat(${this.map.getWidth()}, 1fr)`
        });
    }
}
