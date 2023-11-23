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
     * The cell type.
     */
    type;
    /**
     * Indicates whether the cell is an exit.
     */
    isExit = false;
    /**
     * Creates a new cell from a descriptor.
     * The valid descriptors are:
     * - ' ' for an empty cell
     * - '#' for a wall
     * - 'P' for the player
     * - 'E' for the exit
     * - 'X' for the player and exit
     * @param descriptor A single character describing the cell.
     * @throws If the descriptor isn't a single character.
     * @throws If the descriptor is an unrecognised character.
     */
    constructor(descriptor) {
        if (1 !== descriptor.length)
            throw new Error("Cell descriptors must be a single character");
        if (!Cell.VALID_DESCRIPTORS.includes(descriptor))
            throw new Error(`Invalid cell descriptor '${descriptor}'`);
        switch (descriptor) {
            case '#':
                this.type = CellType.WALL;
                break;
            case 'X': this.isExit = true;
            case ' ':
            case 'P':
            case 'E': this.type = CellType.EMPTY;
        }
    }
    /**
     * Creates a cell from a data object.
     * @param data A cell object.
     * @return A new cell instance.
     */
    static fromData(data) {
        const cell = new Cell(' '); // Create with dummy descriptor
        cell.type = data.type;
        cell.isExit = data.isExit;
        return cell;
    }
}
