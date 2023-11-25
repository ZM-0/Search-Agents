import { Action } from "../model/action.js";


/**
 * A state in the state space.
 */
export class State {
    /**
     * The player's (x, y) position.
     */
    public readonly playerPosition: [number, number];


    /**
     * Creates a new state.
     * @param playerPosition The player's (x, y) position where (0, 0) is the bottom-left cell.
     */
    constructor(playerPosition: [number, number]) {
        this.playerPosition = playerPosition;
    }
}


/**
 * A node in a search tree.
 */
export class Node {
    /**
     * The state at the node.
     */
    public readonly state: State;


    /**
     * The parent node.
     */
    public readonly parent: Node | null;


    /**
     * The action taken from the parent to this state.
     */
    public readonly action: Action | null;


    /**
     * The total path cost from the start state to this state.
     */
    public readonly pathCost: number;


    /**
     * Creates a new search node.
     * @param state The state at the node.
     * @param parent The parent node.
     * @param action The action to get to this node.
     * @param pathCost The total path cost from the start state to this state.
     */
    constructor(state: State, parent: Node | null = null, action: Action | null = null, pathCost: number = 0) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.pathCost = pathCost;
    }
}