import { CellView, DisplaySetting } from "./cell-view.js";
import { PlayerView } from "./player-view.js";
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
     * The display for the player.
     */
    playerView;
    /**
     * Creates a new map display.
     * @param map The map to be displayed.
     */
    constructor(map) {
        this.map = map;
        $(".map-section").append(`<div class="map"></div>`); // Create the map element
        this.createCellViews(); // Create the cell displays
        this.findCellSize(); // Calculate the cell size
        this.setStyles(); // Style the map element
        this.playerView = new PlayerView(this.map.player); // Create the player display
        // Update the cell and map displays if the window size changes
        $(window).on("resize", () => {
            this.findCellSize();
            this.setStyles();
            this.playerView.update();
        });
    }
    /**
     * Creates displays for all the cells in the map.
     */
    createCellViews() {
        for (let i = 0; i < this.map.getHeight(); i++) {
            this.cellViews.push([]);
            for (let j = 0; j < this.map.getWidth(); j++) {
                const cellView = new CellView(this.map.getCell(i, j));
                this.cellViews[i].push(cellView);
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
    /**
     * Gets the display for a cell.
     * @param row The row index of the cell.
     * @param column The column index of the cell.
     * @returns The selected cell view.
     */
    getCellView(row, column) {
        return this.cellViews[row][column];
    }
    /**
     * Destroys this map view from the browser display.
     */
    destroy() {
        $(".map").remove();
    }
    /**
     * Resets the displays of all cells to their default settings.
     */
    reset() {
        this.cellViews.forEach((row) => {
            row.forEach((cellView) => {
                cellView.displaySetting = DisplaySetting.DEFAULT;
                cellView.update();
            });
        });
    }
}
