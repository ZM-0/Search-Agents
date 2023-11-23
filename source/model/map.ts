import { Cell } from "./cell.js";


/**
 * A grid map of cells.
 */
export class Map {
    /**
     * The cells in the map.
     */
    private readonly cells: Cell[][] = [];


    /**
     * Creates a new map from a string map layout.
     * @param mapString A string describing a map layout.
     * @throws If the map string isn't rectangular.
     * @throws If the map string contains an unidentified character.
     */
    constructor(mapString: string) {
        const rows: string[] = mapString.split(/\r?\n/);
        const width: number = rows[0].length;

        for (let i: number = 0; i < rows.length; i++) {
            if (rows[i].length !== width) throw new Error("The map must be rectangular");
            this.cells.push([]);

            for (let j: number = 0; j < rows[i].length; j++) {
                try {
                    this.cells[i].push(new Cell(rows[i][j]));
                } catch (error) {
                    throw error;
                }
            }
        }
    }
}