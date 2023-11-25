/**
 * A state in the state space.
 */
export class State {
    /**
     * The player's (x, y) position.
     */
    playerPosition;
    /**
     * Creates a new state.
     * @param playerPosition The player's (x, y) position where (0, 0) is the bottom-left cell.
     */
    constructor(playerPosition) {
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
    state;
    /**
     * The parent node.
     */
    parent;
    /**
     * The action taken from the parent to this state.
     */
    action;
    /**
     * The total path cost from the start state to this state.
     */
    pathCost;
    /**
     * Creates a new search node.
     * @param state The state at the node.
     * @param parent The parent node.
     * @param action The action to get to this node.
     * @param pathCost The total path cost from the start state to this state.
     */
    constructor(state, parent, action, pathCost) {
        this.state = state;
        this.parent = parent;
        this.action = action;
        this.pathCost = pathCost;
    }
}
