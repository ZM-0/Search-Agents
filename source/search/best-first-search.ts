import { Action } from "../model/action.js";
import { Node, State } from "./utilities.js";


/**
 * The best-first graph-search algorithm.
 */
export class BestFirstSearcher {
    /**
     * The initial state in the problem formulation.
     */
    private readonly initialState: State;


    /**
     * Runs the best-first graph-search algorithm.
     * @returns A list of the actions in the solution path.
     */
    public search(): Action[] {

    }


    /**
     * Builds the action sequence from the start state to the state at the given goal node.
     * @param node The goal node at the end of the solution path.
     */
    private buildPath(node: Node): Action[] {

    }


    /**
     * Expands a node and finds all successor nodes.
     * @param node The node to expand.
     * @param A list of the successor nodes.
     */
    private expand(node: Node): Node[] {

    }


    /**
     * Checks if a state is a goal state.
     * @param state The state to check for.
     * @returns True if the state is a goal, false if not.
     */
    private isGoal(state: State): boolean {

    }


    /**
     * Gets the valid actions from a state.
     * @param state The state to take the action from.
     * @returns A list of the valid actions out of the given state.
     */
    private getActions(state: State): Action[] {

    }


    /**
     * Gets the resulting state of a transition.
     * @param state The state to transition from.
     * @param action The action to take.
     * @returns The state resulting from the transition.
     */
    private transition(state: State, action: Action): State {

    }


    /**
     * Gets the cost associated with a transition.
     * @param startState The state before the action.
     * @param action The action taken.
     * @param nextState The state after the action.
     * @returns The action cost of the transition.
     */
    private getActionCost(startState: State, action: Action, nextState: State): number {

    }
}