/**
 * A cell in a grid map.
 */
export class Cell {
    /**
     * The valid cell descriptors.
     */
    static VALID_DESCRIPTORS = [' ', '#', 'P', 'E', 'X'];
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
    }
}
