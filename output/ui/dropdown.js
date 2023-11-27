/**
 * A custom dropdown menu.
 */
export class Dropdown {
    /**
     * The dropdown HTML selector.
     */
    selector;
    /**
     * A live array of the dropdown options.
     */
    options;
    /**
     * The index of the selected option.
     */
    _selection = 0;
    /**
     * Indicates if the dropdown is open.
     */
    isOpen = false;
    /**
     * Creates a new dropdown menu.
     * @param selector The dropdown selector.
     * @param options A live array of the dropdown options.
     */
    constructor(selector, options) {
        this.selector = selector;
        this.options = options;
        $(this.selector)
            .append(`<div class="dropdown-item dropdown-item-default">Select an option</div>`)
            .append(`<hr class="divider"/>`)
            .css("inset", `auto calc((100px - ${$(this.selector).width()}px) / 2)`);
        $(this.selector + " > hr").hide();
        // Toggle the dropdown menu on click
        $(this.selector).on("click", () => {
            this.isOpen ? this.hide() : this.show();
            this.isOpen = !this.isOpen;
        });
    }
    /**
     * Gets the current selection.
     * @returns The currently selected index.
     */
    get selection() {
        return this._selection;
    }
    /**
     * Sets the current selection.
     * @param index The index of the option to select.
     * @throws If the index is out of range.
     */
    set selection(index) {
        if (0 > index || this.options.length <= index)
            throw new RangeError("Selection index out of range");
        this._selection = index;
        $(`${this.selector} > .dropdown-item-default`).text(this.options[index]);
    }
    /**
     * Opens the dropdown.
     */
    show() {
        $(`${this.selector} > hr.divider`).show();
        console.log("options", this.options);
        // Create dropdown items for each option
        $(this.selector).append(...this.options.map((option, index) => `<div class="dropdown-item dropdown-item-${index}">${option}</div>`));
        // Make an item the selection when it is clicked
        this.options.forEach((option, index) => {
            $(`${this.selector} > .dropdown-item-${index}`).on("click", () => {
                this.selection = index;
            });
        });
    }
    /**
     * Hides the dropdown.
     */
    hide() {
        $(`${this.selector} > hr.divider`).hide();
        $(`${this.selector} > .dropdown-item`).not(".dropdown-item-default").remove();
    }
}
