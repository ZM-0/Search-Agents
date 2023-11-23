import { Cell } from "./cell.js";
/**
 * A grid map of cells.
 */
export class Map {
    /**
     * The cells in the map.
     */
    cells = [];
    /**
     * Creates a new map from a string map layout.
     * @param mapString A string describing a map layout.
     * @throws If the map string is empty.
     * @throws If the map string isn't rectangular.
     * @throws If the map string contains an unidentified character.
     */
    constructor(mapString) {
        if (0 === mapString.length)
            throw new Error("The map string cannot be empty");
        const rows = mapString.split(/\r?\n/);
        const width = rows[0].length;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].length !== width)
                throw new Error("The map must be rectangular");
            this.cells.push([]);
            for (let j = 0; j < rows[i].length; j++) {
                try {
                    this.cells[i].push(new Cell(rows[i][j]));
                }
                catch (error) {
                    throw error;
                }
            }
        }
    }
    /**
     * Creates a map from a data object.
     * @param data A map data object.
     * @returns A new map instance.
     * @throws If the map cell data is empty.
     * @throws If the map cell data isn't rectangular.
     */
    static fromData(data) {
        if (0 === data.cells.length)
            throw new Error("The map data cannot have no cells");
        const map = new Map(" "); // Create dummy map
        map.cells = [];
        const width = data.cells[0].length;
        for (let i = 0; i < data.cells.length; i++) {
            if (data.cells[i].length !== width)
                throw new Error("The cell data must be a 2D rectangular array");
            map.cells.push([]);
            for (let j = 0; j < data.cells[i].length; j++) {
                map.cells[i].push(Cell.fromData(data.cells[i][j]));
            }
        }
        return map;
    }
}
