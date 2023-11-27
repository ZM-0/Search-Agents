/**
 * An action the player may take.
 */
export class Action {
    /**
     * Instances of the standard actions.
     */
    static actions = [];
    /**
     * The (dx, dy) change in position of the action.
     */
    delta;
    /**
     * Creates a new action.
     * @param delta The (dx, dy) change in position of the action.
     */
    constructor(delta) {
        this.delta = delta.map((value) => value);
    }
    /**
     * Creates the standard actions.
     */
    static setup() {
        Action.actions.push(new Action([0, 1])); // Up
        Action.actions.push(new Action([0, -1])); // Down
        Action.actions.push(new Action([-1, 0])); // Left
        Action.actions.push(new Action([1, 0])); // Right
    }
    /**
     * Gets the up action.
     * @returns The action to move 1 cell up.
     */
    static up() {
        if (0 === Action.actions.length)
            Action.setup();
        return Action.actions[0];
    }
    /**
     * Gets the down action.
     * @returns The action to move 1 cell down.
     */
    static down() {
        if (0 === Action.actions.length)
            Action.setup();
        return Action.actions[1];
    }
    /**
     * Gets the left action.
     * @returns The action to move 1 cell left.
     */
    static left() {
        if (0 === Action.actions.length)
            Action.setup();
        return Action.actions[2];
    }
    /**
     * Gets the right action.
     * @returns The action to move 1 cell right.
     */
    static right() {
        if (0 === Action.actions.length)
            Action.setup();
        return Action.actions[3];
    }
    /**
     * Applies the action to a position.
     * @param position The position to apply the action to.
     * @returns The position resulting from the action.
     */
    applyTo(position) {
        const nextPosition = position.map((value) => value);
        nextPosition[0] += this.delta[0];
        nextPosition[1] += this.delta[1];
        return nextPosition;
    }
}
