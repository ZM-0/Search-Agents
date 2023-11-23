/**
 * The types of cells.
 */
export enum CellType {
    EMPTY,
    WALL
}


/**
 * An interface for cell objects.
 */
export interface ICell {
    type: CellType;
    isExit: boolean;
}


/**
 * A cell in a grid map.
 */
export class Cell {
    /**
     * The valid cell descriptors.
     */
    private static readonly VALID_DESCRIPTORS: string[] = [' ', '#', 'P', 'E', 'X'];


    /**
     * The cell type.
     */
    private type!: CellType;


    /**
     * Indicates whether the cell is an exit.
     */
    private isExit: boolean = false;


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
    constructor(descriptor: string) {
        if (1 !== descriptor.length) throw new Error("Cell descriptors must be a single character");
        if (!Cell.VALID_DESCRIPTORS.includes(descriptor)) throw new Error(`Invalid cell descriptor '${descriptor}'`);

        switch (descriptor) {
            case '#': this.type = CellType.WALL; break;
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
    public static fromData(data: ICell): Cell {
        const cell: Cell = new Cell(' ');   // Create with dummy descriptor
        cell.type = data.type;
        cell.isExit = data.isExit;
        return cell;
    }
}