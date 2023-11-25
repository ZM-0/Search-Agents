/**
 * The types of cells.
 */
export enum CellType {
    EMPTY,
    WALL
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
    private _type!: CellType;


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
            case ' ': this._type = CellType.EMPTY; break;
            case '#': this._type = CellType.WALL; break;
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
    get type(): CellType {
        return this._type;
    }


    /**
     * Checks if the cell can have the given type.
     * @param cellType The type to set the cell to.
     */
    public canHaveType(cellType: CellType): boolean {
        return CellType.EMPTY === cellType || !this.hasPlayer && !this.isExit;
    }


    /**
     * Sets the cell type. If the cell has a player or is an exit, the type cannot be set to a wall.
     * @param newType The new cell type.
     * @throws When trying to set a cell to a wall when it is an exit or has a player.
     */
    set type(newType: CellType) {
        if (!this.canHaveType(newType)) throw new Error("A cell with a player or an exit can't be a wall");
        this._type = newType;
    }


    /**
     * Checks if the cell is an exit.
     */
    get isExit(): boolean {
        return this._isExit;
    }


    /**
     * Checks if the cell can be an exit.
     * @returns True if the cell can be an exit, else false.
     */
    public canBeExit(): boolean {
        return CellType.EMPTY === this.type;
    }


    /**
     * Sets if the cell is an exit.
     * @param setExit Indicates whether to set the cell as an exit or not.
     * @throws When trying to set a cell to an exit when it can't be an exit.
     */
    set isExit(setExit: boolean) {
        if (setExit && !this.canBeExit()) throw new Error("Can't set a wall to an exit");
        this._isExit = setExit;
    }


    /**
     * Checks if the cell has a player on it.
     */
    get hasPlayer(): boolean {
        return this._hasPlayer;
    }


    /**
     * Checks if the cell can have a player.
     * @returns True if the cell can have a player, false if not.
     */
    public canHavePlayer(): boolean {
        return CellType.EMPTY === this.type;
    }


    /**
     * Sets if the cell has a player on it.
     * @param setPlayer Indicates whether to set a player on the cell or not.
     * @throws When trying to set a player on a cell that can't have a player.
     */
    set hasPlayer(setPlayer: boolean) {
        if (setPlayer && !this.canHavePlayer()) throw new Error("Can't set a player on a wall");
        this._hasPlayer = setPlayer;
    }


    /**
     * Converts the cell to a string descriptor.
     * @returns A single character cell descriptor.
     */
    public toString(): string {
        if (this.isExit && this.hasPlayer) return 'X';
        else if (this.hasPlayer) return 'P';
        else if (this.isExit) return 'E';
        else switch (this.type) {
            case CellType.EMPTY: return ' ';
            case CellType.WALL: return '#';
        }
    }
}