/**
 * The types of cells.
 */
export var CellType;
(function (CellType) {
    CellType[CellType["EMPTY"] = 0] = "EMPTY";
    CellType[CellType["WALL"] = 1] = "WALL";
})(CellType || (CellType = {}));
/**
 * A cell in a grid map.
 */
export class Cell {
    /**
     * The valid cell descriptors.
     */
    static VALID_DESCRIPTORS = [' ', '#', 'P', 'E', 'X'];
    /**
     * The cells row and column index in the map.
     */
    position;
    /**
     * The cell type.
     */
    type;
    /**
     * Indicates whether the cell is an exit.
     */
    _isExit = false;
    /**
     * Indicates whether the cell has a player on it.
     */
    _hasPlayer = false;
    /**
     * Creates a new cell from a descriptor.
     * The valid descriptors are:
     * - ' ' for an empty cell
     * - '#' for a wall
     * - 'P' for the player
     * - 'E' for the exit
     * - 'X' for the player and exit
     * @param descriptor A single character describing the cell.
     * @param position The cell's row and column in the map.
     * @throws If the descriptor isn't a single character.
     * @throws If the descriptor is an unrecognised character.
     */
    constructor(descriptor, position) {
        if (1 !== descriptor.length)
            throw new Error("Cell descriptors must be a single character");
        if (!Cell.VALID_DESCRIPTORS.includes(descriptor))
            throw new Error(`Invalid cell descriptor '${descriptor}'`);
        this.position = position.map((value) => value);
        switch (descriptor) {
            case ' ':
                this.type = CellType.EMPTY;
                break;
            case '#':
                this.type = CellType.WALL;
                break;
            case 'P':
                this._hasPlayer = true;
                this.type = CellType.EMPTY;
                break;
            case 'X': this._hasPlayer = true;
            case 'E':
                this._isExit = true;
                this.type = CellType.EMPTY;
        }
    }
    /**
     * Checks if the cell is an exit.
     */
    get isExit() {
        return this._isExit;
    }
    /**
     * Sets if the cell is an exit.
     * @throws When trying to set a cell to an exit when it can't be an exit.
     */
    set isExit(setExit) {
        if (setExit && CellType.WALL === this.type)
            throw new Error("Can't set a wall to an exit");
        this._isExit = setExit;
    }
    /**
     * Checks if the cell has a player on it.
     */
    get hasPlayer() {
        return this._hasPlayer;
    }
    /**
     * Sets if the cell has a player on it.
     * @throws When trying to set a player on a cell that can't have a player.
     */
    set hasPlayer(setPlayer) {
        if (setPlayer && CellType.WALL === this.type)
            throw new Error("Can't set a player on a wall");
        this._hasPlayer = setPlayer;
    }
}
