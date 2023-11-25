/**
 * An action the player may take.
 */
export class Action {
    /**
     * Instances of the standard actions.
     */
    private static actions: Action[] = [];


    /**
     * The (x, y) change in position of the action.
     */
    private readonly delta: [number, number];


    /**
     * Creates a new action.
     * @param delta The (x, y) change in position of the action.
     */
    constructor(delta: [number, number]) {
        this.delta = delta.map((value: number) => value) as [number, number];
    }


    /**
     * Creates the standard actions.
     */
    private static setup(): void {
        Action.actions.push(new Action([0, 1]));    // Up
        Action.actions.push(new Action([0, -1]));   // Down
        Action.actions.push(new Action([-1, 0]));   // Left
        Action.actions.push(new Action([1, 0]));    // Right
    }


    /**
     * Gets the up action.
     * @returns The action to move 1 cell up.
     */
    public static up(): Action {
        if (0 === Action.actions.length) Action.setup();
        return Action.actions[0];
    }


    /**
     * Gets the down action.
     * @returns The action to move 1 cell down.
     */
    public static down(): Action {
        if (0 === Action.actions.length) Action.setup();
        return Action.actions[1];
    }


    /**
     * Gets the left action.
     * @returns The action to move 1 cell left.
     */
    public static left(): Action {
        if (0 === Action.actions.length) Action.setup();
        return Action.actions[2];
    }


    /**
     * Gets the right action.
     * @returns The action to move 1 cell right.
     */
    public static right(): Action {
        if (0 === Action.actions.length) Action.setup();
        return Action.actions[3];
    }


    /**
     * Applies the action to a position.
     * @param position The position to apply the action to.
     * @returns The position resulting from the action.
     */
    public applyTo(position: [number, number]): [number, number] {
        const nextPosition: [number, number] = position.map((value: number) => value) as [number, number];
        nextPosition[0] += this.delta[0];
        nextPosition[1] += this.delta[1];
        return nextPosition;
    }
}