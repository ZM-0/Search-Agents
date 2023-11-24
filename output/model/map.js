import { Cell } from "./cell.js";
import { Player } from "./player.js";
/**
 * A grid map of cells.
 */
export class Map {
    /**
     * The cells in the map.
     */
    cells = [];
    /**
     * The player.
     */
    player;
    /**
     * The map exit.
     */
    exit;
    /**
     * Creates a new map from a string map layout.
     * @param mapString A string describing a map layout.
     * @throws If the map string is empty.
     * @throws If the map string isn't rectangular.
     * @throws If the map string contains an unidentified character.
     * @throws If the map doesn't have a player or has multiple players.
     * @throws If the map doesn't have an exit or has multiple exits.
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
                this.cells[i].push(new Cell(rows[i][j], [i, j]));
                // Check and set the player
                if (this.cells[i][j].hasPlayer && this.player)
                    throw new Error("The map can't have multiple players");
                else if (this.cells[i][j].hasPlayer)
                    this.player = new Player(this.cells[i][j]);
                // Check and set the exit
                if (this.cells[i][j].isExit && this.exit)
                    throw new Error("The map can't have multiple exits");
                else if (this.cells[i][j].isExit) {
                    this.exit = this.cells[i][j];
                }
            }
        }
        if (!this.player)
            throw new Error("The map must have one player");
        if (!this.exit)
            throw new Error("The map must have one exit");
    }
    /**
     * Gets the map height in cells.
     * @returns The map height in cells.
     */
    getHeight() {
        return this.cells.length;
    }
    /**
     * Gets the map width in cells.
     * @returns The map width in cells.
     */
    getWidth() {
        return this.cells[0].length;
    }
    /**
     * Gets a cell from the map.
     * @param row The cell row index.
     * @param column The cell column index.
     * @returns The selected cell.
     */
    getCell(row, column) {
        return this.cells[row][column];
    }
}
