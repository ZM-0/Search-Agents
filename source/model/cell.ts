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
    position: [number, number];
    type: CellType;
    _isExit: boolean;
    _hasPlayer: boolean;
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
     * The cells row and column index in the map.
     */
    public readonly position: [number, number];


    /**
     * The cell type.
     */
    private readonly type!: CellType;


    /**
     * Indicates whether the cell is an exit.
     */
    private _isExit: boolean = false;


    /**
     * Indicates whether the cell has a player on it.
     */
    private _hasPlayer: boolean = false;


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
    constructor(descriptor: string, position: [number, number]) {
        if (1 !== descriptor.length) throw new Error("Cell descriptors must be a single character");
        if (!Cell.VALID_DESCRIPTORS.includes(descriptor)) throw new Error(`Invalid cell descriptor '${descriptor}'`);

        this.position = position.map((value: number) => value) as [number, number];

        switch (descriptor) {
            case ' ': this.type = CellType.EMPTY; break;
            case '#': this.type = CellType.WALL; break;
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
    get isExit(): boolean {
        return this._isExit;
    }


    /**
     * Sets if the cell is an exit.
     * @throws When trying to set a cell to an exit when it can't be an exit.
     */
    set isExit(setExit: boolean) {
        if (setExit && CellType.WALL === this.type) throw new Error("Can't set a wall to an exit");
        this._isExit = setExit;
    }


    /**
     * Checks if the cell has a player on it.
     */
    get hasPlayer(): boolean {
        return this._hasPlayer;
    }


    /**
     * Sets if the cell has a player on it.
     * @throws When trying to set a player on a cell that can't have a player.
     */
    set hasPlayer(setPlayer: boolean) {
        if (setPlayer && CellType.WALL === this.type) throw new Error("Can't set a player on a wall");
        this._hasPlayer = setPlayer;
    }
}