import { Cell } from "../model/cell.js";
import { Map } from "../model/map.js";
import { CellView, DisplaySetting } from "./cell-view.js";
import { PlayerView } from "./player-view.js";


/**
 * Displays a map in the browser.
 */
export class MapView {
    /**
     * The gap between cells in pixels.
     */
    private static readonly GAP: number = 1;


    /**
     * The map being displayed.
     */
    private readonly map: Map;


    /**
     * The map display height.
     */
    private mapDisplayHeight!: string;


    /**
     * The map display width.
     */
    private mapDisplayWidth!: string;


    /**
     * The edge length of each cell.
     */
    private cellSize!: string;


    /**
     * The displays for the cells.
     */
    private readonly cellViews: CellView[][] = [];


    /**
     * The display for the player.
     */
    private readonly playerView: PlayerView;


    /**
     * Indicates if the player is being dragged.
     */
    private draggingPlayer: boolean = false;


    /**
     * The cell view of the exit cell before dragging the exit.
     */
    private exitView: CellView | null = null;


    /**
     * Creates a new map display.
     * @param map The map to be displayed.
     */
    constructor(map: Map) {
        this.map = map;
        $(".map-section").append(`<div class="map"></div>`);    // Create the map element
        this.createCellViews();                                 // Create the cell displays
        this.findCellSize();                                    // Calculate the cell size
        this.setStyles();                                       // Style the map element
        this.playerView = new PlayerView(this.map.player);      // Create the player display

        // Update the cell and map displays if the window size changes
        $(window).on("resize", () => {
            this.findCellSize();
            this.setStyles();
            this.playerView.update();
        });
    }


    /**
     * Adds event handlers to a cell view for player dragging.
     * @param cellView The cell view to add the handlers to.
     */
    private addPlayerDragHandlers(cellView: CellView): void {
        // Start dragging the player
        $(cellView.selector).on("mousedown", () => {
            if (cellView.cell.hasPlayer) this.draggingPlayer = true;
        });

        // Stop dragging the player
        $(cellView.selector).on("mouseup", () => {
            if (this.draggingPlayer && cellView.cell.canHavePlayer()) {
                this.map.movePlayer(cellView.cell);
                this.playerView.move(cellView.cell);
            }

            this.draggingPlayer = false;
        });
    }


    /**
     * Adds event handlers to a cell view for exit dragging.
     * @param cellView The cell view to add the handlers to.
     */
    private addExitDragHandlers(cellView: CellView): void {
        // Start dragging the exit
        $(cellView.selector).on("mousedown", () => {
            if (cellView.cell.isExit && !cellView.cell.hasPlayer) this.exitView = cellView;
        });

        // Stop dragging the exit
        $(cellView.selector).on("mouseup", () => {
            if (null !== this.exitView && cellView.cell.canBeExit()) {
                this.map.moveExit(cellView.cell);
                this.exitView.update();
                cellView.update();
            }

            this.exitView = null;
        });
    }


    /**
     * Creates displays for all the cells in the map.
     */
    private createCellViews(): void {
        for (let i: number = 0; i < this.map.getHeight(); i++) {
            this.cellViews.push([]);

            for (let j: number = 0; j < this.map.getWidth(); j++) {
                const cellView: CellView = new CellView(this.map.getCell(i, j));
                this.cellViews[i].push(cellView);
                this.addPlayerDragHandlers(cellView);
                this.addExitDragHandlers(cellView);
            }
        }
    }


    /**
     * Calculates the cell size.
     */
    private findCellSize(): void {
        this.cellSize = `min(
            calc(${$(".map-section").height()! - MapView.GAP * (this.map.getHeight() - 1)}px / ${this.map.getHeight()}),
            calc(${$(".map-section").width()! - MapView.GAP * (this.map.getWidth() - 1)}px / ${this.map.getWidth()})
        )`;

        $(".cell").css({"height": this.cellSize, "width": this.cellSize});

        this.mapDisplayHeight = `calc(${this.map.getHeight()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
        this.mapDisplayWidth = `calc(${this.map.getWidth()} * (${this.cellSize} + ${MapView.GAP}px) - ${MapView.GAP}px)`;
    }


    /**
     * Sets the CSS styles for the map.
     */
    private setStyles(): void {
        $(".map").css({
            "height": this.mapDisplayHeight,
            "width": this.mapDisplayWidth,
            "inset": `
                calc((${$(".map-section").height()!}px - ${this.mapDisplayHeight}) / 2)
                calc((${$(".map-section").width()!}px - ${this.mapDisplayWidth}) / 2)`,
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
    public getCellView(row: number, column: number): CellView {
        return this.cellViews[row][column];
    }


    /**
     * Destroys this map view from the browser display.
     */
    public destroy(): void {
        $(".map").remove();
    }


    /**
     * Resets the displays of all cells to their default settings.
     */
    public reset(): void {
        this.cellViews.forEach((row: CellView[]) => {
            row.forEach((cellView: CellView) => {
                cellView.displaySetting = DisplaySetting.DEFAULT;
                cellView.update();
            });
        });
    }
}