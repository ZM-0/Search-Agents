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
     * The map display height.
     */
    mapDisplayHeight;
    /**
     * The map display width.
     */
    mapDisplayWidth;
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
        $(".map-section").append(`<div class="map"></div>`); // Create the map element
        this.createCellViews(); // Create the cell displays
        this.findCellSize(); // Calculate the cell size
        this.setStyles(); // Create and style the map element
        // Update the cell and map displays if the window size changes
        $(window).on("resize", () => {
            this.findCellSize();
            this.setStyles();
        });
    }
    /**
     * Creates displays for all the cells in the map.
     */
    createCellViews() {
        for (let i = 0; i < this.map.getHeight(); i++) {
            this.cellViews.push([]);
            for (let j = 0; j < this.map.getWidth(); j++) {
                this.cellViews[i].push(new CellView(this.map.getCell(i, j)));
            }
        }
    }
    /**
     * Calculates the cell size.
     */
    findCellSize() {
        this.cellSize = `min(
            calc(${$(".map-section").height() - MapView.GAP * (this.map.getHeight() - 1)}px / ${this.map.getHeight()}),
            calc(${$(".map-section").width() - MapView.GAP * (this.map.getWidth() - 1)}px / ${this.map.getWidth()})
        )`;
        $(".cell").css({ "height": this.cellSize, "width": this.cellSize });
        this.mapDisplayHeight = `calc(${this.map.getHeight()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
        this.mapDisplayWidth = `calc(${this.map.getWidth()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
    }
    /**
     * Sets the CSS styles for the map.
     */
    setStyles() {
        $(".map").css({
            "height": this.mapDisplayHeight,
            "width": this.mapDisplayWidth,
            "inset": `
                calc((${$(".map-section").height()}px - ${this.mapDisplayHeight}) / 2)
                calc((${$(".map-section").width()}px - ${this.mapDisplayWidth}) / 2)`,
            "grid-template-rows": `repeat(${this.map.getHeight()}, 1fr)`,
            "grid-template-columns": `repeat(${this.map.getWidth()}, 1fr)`
        });
    }
}
