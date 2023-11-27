import { CellController } from "./cell-controller.js";
/**
 * Handles user events on a map.
 */
export class MapController {
    /**
     * The map being managed.
     */
    map;
    /**
     * The display for the map.
     */
    view;
    /**
     * The controllers for each of the cells.
     */
    cellControllers = [];
    /**
     * Indicates if the player is being dragged.
     */
    draggingPlayer = false;
    /**
     * The cell controller of the exit cell before dragging the exit.
     */
    exitController = null;
    /**
     * Creates a new map controller.
     * @param map The map to be managed.
     * @param view The display for the map.
     */
    constructor(map, view) {
        this.map = map;
        this.view = view;
        this.createCellControllers();
    }
    /**
     * Adds event handlers to a cell controller for player dragging.
     * @param cellController The cell controller to add the handlers to.
     */
    addPlayerDragHandlers(cellController) {
        // Start dragging the player
        $(cellController.view.selector).on("mousedown", () => {
            if (cellController.cell.hasPlayer)
                this.draggingPlayer = true;
        });
        // Stop dragging the player
        $(cellController.view.selector).on("mouseup", () => {
            if (this.draggingPlayer && cellController.cell.canHavePlayer()) {
                this.map.movePlayer(cellController.cell);
                this.view.playerView.move(cellController.cell);
            }
            this.draggingPlayer = false;
        });
    }
    /**
     * Adds event handlers to a cell controller for exit dragging.
     * @param cellController The cell controller to add the handlers to.
     */
    addExitDragHandlers(cellController) {
        // Start dragging the exit
        $(cellController.view.selector).on("mousedown", () => {
            if (cellController.cell.isExit && !cellController.cell.hasPlayer)
                this.exitController = cellController;
        });
        // Stop dragging the exit
        $(cellController.view.selector).on("mouseup", () => {
            if (null !== this.exitController && cellController.cell.canBeExit()) {
                this.map.moveExit(cellController.cell);
                this.exitController.view.update();
                cellController.view.update();
            }
            this.exitController = null;
        });
    }
    /**
     * Gets the controller for a cell.
     * @param row The row index of the cell.
     * @param column The column index of the cell.
     * @returns The selected cell controller.
     */
    getCellController(row, column) {
        return this.cellControllers[row][column];
    }
    /**
     * Creates controllers for all of the cells.
     */
    createCellControllers() {
        for (let i = 0; i < this.map.getHeight(); i++) {
            this.cellControllers.push([]);
            for (let j = 0; j < this.map.getWidth(); j++) {
                const cellController = new CellController(this.map.getCell(i, j), this.view.getCellView(i, j));
                this.cellControllers[i].push(cellController);
                this.addPlayerDragHandlers(cellController);
                this.addExitDragHandlers(cellController);
            }
        }
    }
}
