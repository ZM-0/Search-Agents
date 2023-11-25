import { Action } from "../model/action.js";
import { Hashtable } from "./hashtable.js";
import { MinimumHeap } from "./heap.js";
import { Node, State } from "./utilities.js";
/**
 * The best-first graph-search algorithm.
 */
export class BestFirstSearcher {
    /**
     * The map on which the search is conducted.
     */
    map;
    /**
     * Creates a new best-first graph-searcher.
     * @param map The map on which to run searches.
     */
    constructor(map) {
        this.map = map;
    }
    /**
     * Runs the best-first graph-search algorithm.
     * @param initialState The initial problem state.
     * @returns A list of the actions in the solution path.
     */
    search(initialState) {
        const frontier = new MinimumHeap((node) => node.pathCost);
        const reached = new Hashtable(this.map.getHeight(), this.map.getWidth());
        let node = new Node(initialState);
        frontier.insert(node);
        reached.add(node.state, node);
        while (0 < frontier.size()) {
            node = frontier.getMinimum();
            if (this.isGoal(node.state))
                return this.buildPath(node);
            this.expand(node).forEach((child) => {
                if (!reached.has(child.state) || child.pathCost < reached.get(child.state).pathCost) {
                    frontier.insert(child);
                    reached.add(child.state, child);
                }
            });
        }
        return [];
    }
    /**
     * Builds the action sequence from the start state to the state at the given goal node.
     * @param node The goal node at the end of the solution path.
     */
    buildPath(node) {
        const path = [];
        while (null !== node.parent) {
            path.push(node.action);
            node = node.parent;
        }
        return path.reverse();
    }
    /**
     * Expands a node and finds all successor nodes.
     * @param node The node to expand.
     * @param A list of the successor nodes.
     */
    expand(node) {
        const children = [];
        this.getActions(node.state).forEach((action) => {
            const state = this.transition(node.state, action);
            const pathCost = node.pathCost + this.getActionCost(node.state, action, state);
            children.push(new Node(state, node, action, pathCost));
        });
        return children;
    }
    /**
     * Checks if a state is a goal state.
     * @param state The state to check for.
     * @returns True if the state is a goal, false if not.
     */
    isGoal(state) {
        return state.playerPosition[0] === this.map.getExit().position[0] &&
            state.playerPosition[1] === this.map.getExit().position[1];
    }
    /**
     * Gets the valid actions from a state.
     * @param state The state to take the action from.
     * @returns A list of the valid actions out of the given state.
     */
    getActions(state) {
        const allActions = [Action.up(), Action.down(), Action.left(), Action.right()];
        const validActions = [];
        allActions.forEach((action) => {
            const nextState = this.transition(state, action);
            // Validate the state
            if (this.map.getCell(this.map.getHeight() - nextState.playerPosition[1] - 1, nextState.playerPosition[0]).canHavePlayer())
                validActions.push(action);
        });
        return validActions;
    }
    /**
     * Gets the resulting state of a transition.
     * @param state The state to transition from.
     * @param action The action to take.
     * @returns The state resulting from the transition.
     */
    transition(state, action) {
        return new State(action.applyTo(state.playerPosition));
    }
    /**
     * Gets the cost associated with a transition.
     * @param startState The state before the action.
     * @param action The action taken.
     * @param nextState The state after the action.
     * @returns The action cost of the transition.
     */
    getActionCost(startState, action, nextState) {
        return 1;
    }
}
