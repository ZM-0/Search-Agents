import { Cell } from "./cell.js";
import { Player } from "./player.js";


/**
 * A grid map of cells.
 */
export class Map {
    /**
     * The cells in the map.
     */
    private readonly cells: Cell[][] = [];


    /**
     * The player.
     */
    public readonly player!: Player;


    /**
     * The map exit.
     */
    private exit!: Cell;


    /**
     * Creates a new map from a string map layout.
     * @param mapString A string describing a map layout.
     * @throws If the map string is empty.
     * @throws If the map string isn't rectangular.
     * @throws If the map string contains an unidentified character.
     * @throws If the map doesn't have a player or has multiple players.
     * @throws If the map doesn't have an exit or has multiple exits.
     */
    constructor(mapString: string) {
        if (0 === mapString.length) throw new Error("The map string cannot be empty");
        const rows: string[] = mapString.split(/\r?\n/);
        const width: number = rows[0].length;

        for (let i: number = 0; i < rows.length; i++) {
            if (rows[i].length !== width) throw new Error(
                `The map must be rectangular. Expected width ${width} but found width ${rows[i].length}.`
            );
            this.cells.push([]);

            for (let j: number = 0; j < rows[i].length; j++) {
                this.cells[i].push(new Cell(rows[i][j], [i, j]));

                // Check and set the player
                if (this.cells[i][j].hasPlayer && this.player) throw new Error("The map can't have multiple players");
                else if (this.cells[i][j].hasPlayer) this.player = new Player(this.cells[i][j]);

                // Check and set the exit
                if (this.cells[i][j].isExit && this.exit) throw new Error("The map can't have multiple exits");
                else if (this.cells[i][j].isExit) this.exit = this.cells[i][j];
            }
        }

        if (!this.player) throw new Error("The map must have one player");
        if (!this.exit) throw new Error("The map must have one exit");
    }


    /**
     * Gets the map height in cells.
     * @returns The map height in cells.
     */
    public getHeight(): number {
        return this.cells.length;
    }


    /**
     * Gets the map width in cells.
     * @returns The map width in cells.
     */
    public getWidth(): number {
        return this.cells[0].length;
    }


    /**
     * Converts a row-column position to an x-y position.
     * @param rowColumnPosition A row-column position.
     * @returns The corresponding x-y position.
     */
    public toXY(rowColumnPosition: [number, number]): [number, number] {
        return [rowColumnPosition[1], this.getHeight() - rowColumnPosition[0] - 1];
    }


    /**
     * Converts an x-y position to a row-column position.
     * @param xyPosition An x-y position.
     * @returns The corresponding row-column position.
     */
    public toRowColumn(xyPosition: [number, number]): [number, number] {
        return [this.getHeight() - xyPosition[1] - 1, xyPosition[0]];
    }


    /**
     * Gets a cell from the map.
     * @param row The cell row index.
     * @param column The cell column index.
     * @returns The selected cell.
     */
    public getCell(row: number, column: number): Cell {
        return this.cells[row][column];
    }


    /**
     * Checks if a row and column index is within the map.
     * @param row The row index.
     * @param column The colum index.
     * @returns True if the position is within the map, false if not.
     */
    public contains(row: number, column: number): boolean {
        return 0 <= row && this.getHeight() > row && 0 <= column && this.getWidth() > column;
    }


    /**
     * Gets the exit cell.
     * @returns The exit cell.
     */
    public getExit(): Cell {
        return this.exit;
    }


    /**
     * Moves the player onto a cell.
     * @param cell The cell to move the player onto.
     * @throws When trying to set the player on a cell that can't have a player.
     */
    public movePlayer(cell: Cell): void {
        this.player.cell.hasPlayer = false;
        this.player.cell = cell;
        this.player.cell.hasPlayer = true;
    }


    /**
     * Moves the map exit.
     * @param cell The cell to move the exit to.
     * @throws When trying to set a cell which can't be an exit to an exit.
     */
    public moveExit(cell: Cell): void {
        this.exit.isExit = false;
        this.exit = cell;
        this.exit.isExit = true;
    }


    /**
     * Converts the map to a string definition of the map layout.
     * @returns A string representation of the map.
     */
    public toString(): string {
        let mapString: string = "";

        for (let i: number = 0; i < this.getHeight(); i++) {
            for (let j: number = 0; j < this.getWidth(); j++) {
                mapString += this.getCell(i, j).toString();
            }

            if (this.getHeight() - 1 > i) mapString += '\n';
        }

        return mapString;
    }
}