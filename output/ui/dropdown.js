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
    selected = 0;
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
        $(this.selector).append(`<div class="dropdown-item dropdown-item-default">Select an option</div>`);
        $(this.selector).append(`<hr class="divider">`);
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
     * Adds an option to the dropdown.
     * @param option The dropdown option label to add.
     */
    addOption(option) {
        const index = this.options.length;
        if (0 === index)
            $(this.selector + " > .dropdown-item-default").text(option);
        this.options.push(option);
        $(this.selector).append(`<div class="dropdown-item dropdown-item-${index}">${option}</div>`);
        $(this.selector + ` > .dropdown-item-${index}`).hide().on("click", () => {
            this.selected = index;
            $(this.selector + " > .dropdown-item-default").text(option);
        });
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
