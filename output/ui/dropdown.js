/**
 * A custom dropdown menu.
 */
export class Dropdown {
    /**
     * The dropdown HTML selector.
     */
    selector;
    /**
     * The dropdown options.
     */
    options = [];
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
     */
    constructor(selector) {
        this.selector = selector;
        $(this.selector)
            .append(`<div class="dropdown-item dropdown-item-default">Select an option</div>`)
            .append(`<hr class="divider">`)
            .css("inset", `auto calc((100px - ${$(this.selector).width()}px) / 2)`);
        $(this.selector + " > hr").hide();
        // Toggle the dropdown menu on click
        $(this.selector).on("click", () => {
            if (this.isOpen)
                this.hide();
            else
                this.show();
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
     * Adds an option to the dropdown.
     * @param option The dropdown option label to add.
     */
    addOption(option) {
        const index = this.options.length;
        if (0 === index)
            $(this.selector + " > .dropdown-item-default").text(option);
        this.options.push(option);
        $(this.selector).append(`<div class="dropdown-item dropdown-item-${index}">${option}</div>`);
        $(this.selector + ` > .dropdown-item-${index}`).on("click", () => {
            this._selection = index;
            $(this.selector + " > .dropdown-item-default").text(option);
        }).hide();
    }
    /**
     * Sets an option as selected.
     * @param index The index of the option to set as selected.
     */
    setSelection(index) {
        if (0 > index || this.options.length <= index)
            throw new RangeError("Selection index out of range");
        this._selection = index;
        $(this.selector + " > .dropdown-item-default").text(this.options[index]);
    }
    /**
     * Opens the dropdown.
     */
    show() {
        $(this.selector + " > hr").show();
        $(this.selector + " > .dropdown-item").show();
    }
    /**
     * Hides the dropdown.
     */
    hide() {
        $(this.selector + " > hr").hide();
        $(this.selector + " > .dropdown-item").not(".dropdown-item-default").hide();
    }
}
