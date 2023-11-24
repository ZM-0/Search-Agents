import { Cell } from "../model/cell.js";


/**
 * Displays a cell in a map.
 */
export class CellView {
    /**
     * The cell being displayed.
     */
    private readonly cell: Cell;


    /**
     * The CSS selector for the cell.
     */
    private readonly selector: string;


    /**
     * Creates a new cell display.
     * @param cell The cell to be displayed.
     */
    constructor(cell: Cell) {
        this.cell = cell;
        this.selector = `#cell-${this.cell.position[0]}-${this.cell.position[1]}`;

        // Create the cell element
        $(".map").append(`<div id="${this.selector.slice(1)}" class="cell"></div>`);
    }
}