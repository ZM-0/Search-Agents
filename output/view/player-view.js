import { CellView } from "./cell-view.js";
/**
 * Displays the player on a cell.
 */
export class PlayerView {
    /**
     * The player being displayed.
     */
    player;
    /**
     * The CSS selector of the cell the player is currently on.
     */
    cellSelector;
    /**
     * Creates a player display.
     * @param player The player to be displayed.
     */
    constructor(player) {
        this.player = player;
        this.cellSelector = CellView.getSelector(player.cell);
        $(this.cellSelector).append(`<div class="player"></div>`);
        this.update();
    }
    /**
     * Moves the player view on to a different cell.
     * @param cell The cell to move the player view on to.
     */
    move(cell) {
        $(this.cellSelector + " > .player").remove();
        this.cellSelector = CellView.getSelector(cell);
        $(this.cellSelector).append(`<div class="player"></div>`);
        this.update();
    }
    /**
     * Redraws the player.
     */
    update() {
        const cellSize = $(".cell").height();
        const scale = 0.8;
        $(this.cellSelector + " > .player").css({
            "height": `${cellSize * scale}px`,
            "width": `${cellSize * scale}px`,
            "inset": `${cellSize * (1 - scale) / 2}px`
        });
    }
}
