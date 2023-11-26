import { Cell, CellType } from "../model/cell.js";


/**
 * Additional display settings for empty cells.
 */
export enum DisplaySetting {
    DEFAULT,
    IN_PATH,
    IN_FRONTIER,
    IN_REACHED
}


/**
 * Displays a cell in a map.
 */
export class CellView {
    /**
     * The type to set cells to with a click and drag.
     */
    private static floodType: CellType | null = null;


    /**
     * The exit cell view before dragging the exit.
     */
    private static exitView: CellView | null = null;


    /**
     * The cell being displayed.
     */
    public readonly cell: Cell;


    /**
     * The CSS selector for the cell.
     */
    public readonly selector: string;


    /**
     * Additional display settings for the cell if its empty.
     */
    public displaySetting: DisplaySetting = DisplaySetting.DEFAULT;


    /**
     * Creates a new cell display.
     * @param cell The cell to be displayed.
     */
    constructor(cell: Cell) {
        this.cell = cell;
        this.selector = CellView.getSelector(cell);
        $(".map").append(`<div id="${this.selector.slice(1)}" class="cell"></div>`);
        this.update();  // Draw the initial cell

        // Add event handlers
        $(this.selector).on("mousedown", event => event.preventDefault());
        this.addTypeToggleHandler();
        this.addTypeDragHandlers();
    }


    /**
     * Adds an event handler for toggling the cell type.
     */
    private addTypeToggleHandler(): void {
        $(this.selector).on("click", () => {
            if (CellType.EMPTY === this.cell.type && !this.cell.canHaveType(CellType.WALL)) return;
            if (CellType.EMPTY === this.cell.type) this.cell.type = CellType.WALL;
            else this.cell.type = CellType.EMPTY;
            this.update();
        });
    }


    /**
     * Adds event handlers changing and dragging the cell type.
     */
    private addTypeDragHandlers(): void {
        // Start dragging the cell type
        $(this.selector).on("mousedown", () => {
            if (this.cell.isExit || this.cell.hasPlayer) return;
            CellView.floodType = this.cell.type;
        });

        // Set the cell type during a click and drag
        $(this.selector).on("mouseenter", () => {
            if (null !== CellView.floodType && this.cell.canHaveType(CellView.floodType)) {
                this.cell.type = CellView.floodType;
                this.update();
            }
        });

        // Stop type dragging the cell type
        $(this.selector).on("mouseup", () => {
            CellView.floodType = null;
        });
    }


    /**
     * Finds the CSS selector of the display of a cell.
     * @param cell The cell to find the selector of.
     */
    public static getSelector(cell: Cell): string {
        return `#cell-${cell.position[0]}-${cell.position[1]}`;
    }


    /**
     * Redraws the cell.
     */
    public update(): void {
        if (this.cell.isExit) $(this.selector).css("background-color", "#0F0");
        else switch (this.displaySetting) {
            case DisplaySetting.IN_PATH: $(this.selector).css("background-color", "#F0FA"); break;
            case DisplaySetting.IN_FRONTIER: $(this.selector).css("background-color", "#0FF"); break;
            case DisplaySetting.IN_REACHED: $(this.selector).css("background-color", "#0CC"); break;
            case DisplaySetting.DEFAULT: $(this.selector).css(
                "background-color", CellType.EMPTY === this.cell.type ? "#CCF" : "#44F"
            );
        }
    }
}