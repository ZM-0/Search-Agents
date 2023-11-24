import { Cell } from "./cell.js";


/**
 * The player in a map.
 */
export class Player {
    /**
     * The cell the player is on.
     */
    private readonly cell: Cell;


    /**
     * Creates a player on a cell.
     * @param cell The cell the player is on.
     */
    constructor(cell: Cell) {
        this.cell = cell;
    }
}