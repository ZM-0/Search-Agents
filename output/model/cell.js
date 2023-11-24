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
    _type;
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
                this._type = CellType.EMPTY;
                break;
            case '#':
                this._type = CellType.WALL;
                break;
            case 'P':
                this._hasPlayer = true;
                this._type = CellType.EMPTY;
                break;
            case 'X': this._hasPlayer = true;
            case 'E':
                this._isExit = true;
                this._type = CellType.EMPTY;
        }
    }
    /**
     * Gets the current cell type.
     */
    get type() {
        return this._type;
    }
    /**
     * Checks if the cell can have the given type.
     * @param cellType The type to set the cell to.
     */
    canHaveType(cellType) {
        return CellType.EMPTY === cellType || !this.hasPlayer && !this.isExit;
    }
    /**
     * Sets the cell type. If the cell has a player or is an exit, the type cannot be set to a wall.
     * @param newType The new cell type.
     * @throws When trying to set a cell to a wall when it is an exit or has a player.
     */
    set type(newType) {
        if (!this.canHaveType(newType))
            throw new Error("A cell with a player or an exit can't be a wall");
        this._type = newType;
    }
    /**
     * Checks if the cell is an exit.
     */
    get isExit() {
        return this._isExit;
    }
    /**
     * Sets if the cell is an exit.
     * @param setExit Indicates whether to set the cell as an exit or not.
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
     * @param setPlayer Indicates whether to set a player on the cell or not.
     * @throws When trying to set a player on a cell that can't have a player.
     */
    set hasPlayer(setPlayer) {
        if (setPlayer && CellType.WALL === this.type)
            throw new Error("Can't set a player on a wall");
        this._hasPlayer = setPlayer;
    }
    /**
     * Converts the cell to a string descriptor.
     * @returns A single character cell descriptor.
     */
    toString() {
        if (this.isExit && this.hasPlayer)
            return 'X';
        else if (this.hasPlayer)
            return 'P';
        else if (this.isExit)
            return 'E';
        else
            switch (this.type) {
                case CellType.EMPTY: return ' ';
                case CellType.WALL: return '#';
            }
    }
}
