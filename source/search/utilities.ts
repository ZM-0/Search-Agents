/**
 * A state in the state space.
 */
export class State {
    /**
     * The player's (x, y) position.
     */
    private readonly playerPosition: [number, number];


    /**
     * Creates a new state.
     * @param playerPosition The player's (x, y) position.
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
    private readonly state: State;


    /**
     * The parent node.
     */
    private readonly parent: Node;


    /**
     * The action taken from the parent to this state.
     */
    private readonly action;


    /**
     * The total path cost from the start state to this state.
     */
    private readonly pathCost: number;


    /**
     * Creates a new search node.
     * @param state The state at the node.
     * @param parent The parent node.
     * @param action The action to get to this node.
     * @param pathCost The total path cost from the start state to this state.
     */
    constructor(state: State, parent: Node, action, pathCost: number) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.pathCost = pathCost;
    }
}