import { CellType } from "../model/cell.js";
/**
 * Additional display settings for empty cells.
 */
export var DisplaySetting;
(function (DisplaySetting) {
    DisplaySetting[DisplaySetting["DEFAULT"] = 0] = "DEFAULT";
    DisplaySetting[DisplaySetting["IN_PATH"] = 1] = "IN_PATH";
    DisplaySetting[DisplaySetting["IN_FRONTIER"] = 2] = "IN_FRONTIER";
    DisplaySetting[DisplaySetting["IN_REACHED"] = 3] = "IN_REACHED";
})(DisplaySetting || (DisplaySetting = {}));
/**
 * Displays a cell in a map.
 */
export class CellView {
    /**
     * The cell being displayed.
     */
    cell;
    /**
     * The CSS selector for the cell.
     */
    selector;
    /**
     * Additional display settings for the cell if its empty.
     */
    displaySetting = DisplaySetting.DEFAULT;
    /**
     * Creates a new cell display.
     * @param cell The cell to be displayed.
     */
    constructor(cell) {
        this.cell = cell;
        this.selector = CellView.getSelector(cell);
        $(".map").append(`<div id="${this.selector.slice(1)}" class="cell"></div>`);
        this.update(); // Draw the initial cell
    }
    /**
     * Finds the CSS selector of the display of a cell.
     * @param cell The cell to find the selector of.
     */
    static getSelector(cell) {
        return `#cell-${cell.position[0]}-${cell.position[1]}`;
    }
    /**
     * Redraws the cell.
     */
    update() {
        if (this.cell.isExit)
            $(this.selector).css("background-color", "#0F0");
        else
            switch (this.displaySetting) {
                case DisplaySetting.IN_PATH:
                    $(this.selector).css("background-color", "#F0FA");
                    break;
                case DisplaySetting.IN_FRONTIER:
                    $(this.selector).css("background-color", "#0FF");
                    break;
                case DisplaySetting.IN_REACHED:
                    $(this.selector).css("background-color", "#0CC");
                    break;
                case DisplaySetting.DEFAULT: $(this.selector).css("background-color", CellType.EMPTY === this.cell.type ? "#CCF" : "#44F");
            }
    }
}
