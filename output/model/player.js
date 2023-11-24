/**
 * The player in a map.
 */
export class Player {
    /**
     * The cell the player is on.
     */
    cell;
    /**
     * Creates a player on a cell.
     * @param cell The cell the player is on.
     */
    constructor(cell) {
        this.cell = cell;
    }
}
