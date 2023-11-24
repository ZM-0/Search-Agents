import { Cell, ICell } from "./cell.js";
import { Player } from "./player.js";


/**
 * An interface for map objects.
 */
interface IMap {
    cells: ICell[][];
}


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
    private readonly player!: Player;


    /**
     * The map exit.
     */
    private readonly exit!: Cell;


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
            if (rows[i].length !== width) throw new Error("The map must be rectangular");

            this.cells.push([]);

            for (let j: number = 0; j < rows[i].length; j++) {
                this.cells[i].push(new Cell(rows[i][j], [i, j]));

                // Check and set the player
                if (this.cells[i][j].hasPlayer && this.player) throw new Error("The map can't have multiple players");
                else if (this.cells[i][j].hasPlayer) this.player = new Player(this.cells[i][j]);

                // Check and set the exit
                if (this.cells[i][j].isExit && this.exit) throw new Error("The map can't have multiple exits");
                else if (this.cells[i][j].isExit) {
                    console.log(`Found exit at ${i}, ${j}`);
                    this.exit = this.cells[i][j];
                }
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
     * Gets a cell from the map.
     * @param row The cell row index.
     * @param column The cell column index.
     * @returns The selected cell.
     */
    public getCell(row: number, column: number): Cell {
        return this.cells[row][column];
    }
}