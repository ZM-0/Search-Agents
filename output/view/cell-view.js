import { CellType } from "../model/cell.js";
/**
 * Displays a cell in a map.
 */
export class CellView {
    /**
     * The type to set cells to with a click and drag.
     */
    static floodType = null;
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
        this.selector = CellView.getSelector(cell);
        $(".map").append(`<div id="${this.selector.slice(1)}" class="cell"></div>`);
        this.update(); // Draw the initial cell
        // Toggle the cell type when clicked
        $(this.selector).on("click", () => {
            if (CellType.EMPTY === this.cell.type && !this.cell.canHaveType(CellType.WALL))
                return;
            if (CellType.EMPTY === this.cell.type)
                this.cell.type = CellType.WALL;
            else
                this.cell.type = CellType.EMPTY;
            this.update();
        });
        // Prevent default handling
        $(this.selector).on("mousedown", event => event.preventDefault());
        // Start a click and drag of cell types
        $(this.selector).on("mousedown", () => {
            if (this.cell.isExit || this.cell.hasPlayer)
                return;
            CellView.floodType = this.cell.type;
        });
        // Set the cell type during a click and drag
        $(this.selector).on("mouseenter", () => {
            if (null !== CellView.floodType && this.cell.canHaveType(CellView.floodType)) {
                this.cell.type = CellView.floodType;
                this.update();
            }
        });
        // Stop click and drag
        $(this.selector).on("mouseup", () => {
            CellView.floodType = null;
        });
    }
    /**
     * Finds the CSS selector of the display of a cell.
     * @param cell The cell to find the selector of.
     */
    static getSelector(cell) {
        return `#cell-${cell.position[0]}-${cell.position[1]}`;
    }
    /**
     * Redraws the cell.
     */
    update() {
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
