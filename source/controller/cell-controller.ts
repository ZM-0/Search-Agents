import { Cell, CellType } from "../model/cell.js";
import { Publisher } from "../observer/publisher.js";
import { CellView } from "../view/cell-view.js";


/**
 * Handles user events on a cell.
 */
export class CellController extends Publisher {
    /**
     * Indicates whether any cell has unsaved changed.
     */
    public static unsavedChanges: boolean = false;

    
    /**
     * The type to set cells to with a click and drag.
     */
    private static floodType: CellType | null = null;


    /**
     * The cell being managed.
     */
    private readonly cell: Cell;


    /**
     * The display for the cell.
     */
    private readonly view: CellView;


    /**
     * 
     * @param cell The cell to be managed.
     * @param view The display for the cell.
     */
    constructor(cell: Cell, view: CellView) {
        super();
        this.cell = cell;
        this.view = view;
        $(this.view.selector).on("mousedown", event => event.preventDefault());
        this.addTypeToggleHandler();
        this.addTypeDragHandlers();
    }


    /**
     * Adds an event handler for toggling the cell type.
     */
    private addTypeToggleHandler(): void {
        $(this.view.selector).on("click", () => {
            if (CellType.EMPTY === this.cell.type && !this.cell.canHaveType(CellType.WALL)) return;
            if (CellType.EMPTY === this.cell.type) this.cell.type = CellType.WALL;
            else this.cell.type = CellType.EMPTY;
            this.view.update();
            CellController.unsavedChanges = true;
            this.notify();
        });
    }


    /**
     * Adds event handlers for changing and dragging the cell type.
     */
    private addTypeDragHandlers(): void {
        // Start dragging the cell type
        $(this.view.selector).on("mousedown", () => {
            if (this.cell.isExit || this.cell.hasPlayer) return;
            CellController.floodType = this.cell.type;
        });

        // Set the cell type during a click and drag
        $(this.view.selector).on("mouseenter", () => {
            if (null !== CellController.floodType && this.cell.canHaveType(CellController.floodType)) {
                this.cell.type = CellController.floodType;
                this.view.update();
                CellController.unsavedChanges = true;
                this.notify();
            }
        });

        // Stop type dragging the cell type
        $(this.view.selector).on("mouseup", () => {
            CellController.floodType = null;
        });
    }
}