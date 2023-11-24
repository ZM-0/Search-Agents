import { CellType } from "../model/cell.js";
/**
 * Displays a cell in a map.
 */
export class CellView {
    /**
     * The cell being displayed.
     */
    cell;
    /**
     * The CSS selector for the cell.
     */
    selector;
    /**
     * Creates a new cell display.
     * @param cell The cell to be displayed.
     */
    constructor(cell) {
        this.cell = cell;
        this.selector = `#cell-${this.cell.position[0]}-${this.cell.position[1]}`;
        // Create the cell element
        $(".map").append(`<div id="${this.selector.slice(1)}" class="cell"></div>`);
        // Style the cell
        if (this.cell.isExit)
            $(this.selector).css("background-color", "#0F0");
        else
            switch (this.cell.type) {
                case CellType.EMPTY:
                    $(this.selector).css("background-color", "#CCF");
                    break;
                case CellType.WALL: $(this.selector).css("background-color", "#44F");
            }
    }
}
