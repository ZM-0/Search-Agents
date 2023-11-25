import { Action } from "../model/action.js";
import { Map } from "../model/map.js";
import { CellView, DisplaySetting } from "../view/cell-view.js";
import { MapView } from "../view/map-view.js";
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
    private readonly map: Map;


    /**
     * The display for the map.
     */
    private readonly mapView: MapView;


    /**
     * Creates a new best-first graph-searcher.
     * @param map The map on which to run searches.
     * @param mapView The display for the map.
     */
    constructor(map: Map, mapView: MapView) {
        this.map = map;
        this.mapView = mapView;
    }


    /**
     * Runs the best-first graph-search algorithm.
     * @param initialState The initial problem state.
     * @returns A list of the actions in the solution path.
     */
    public async search(initialState: State): Promise<Action[]> {
        const frontier: MinimumHeap = new MinimumHeap((node: Node) => node.pathCost);
        const reached: Hashtable = new Hashtable(this.map.getHeight(), this.map.getWidth());
        let node: Node = new Node(initialState);

        frontier.insert(node);
        reached.add(node.state, node);
        this.stylePosition(node.state.playerPosition, DisplaySetting.IN_FRONTIER);

        while (0 < frontier.size()) {
            await this.pause(10);
            node = frontier.getMinimum()!;
            this.stylePosition(node.state.playerPosition, DisplaySetting.IN_REACHED);
            if (this.isGoal(node.state)) return this.buildPath(node);

            this.expand(node).forEach((child: Node) => {
                if (!reached.has(child.state) || child.pathCost < reached.get(child.state)!.pathCost) {
                    frontier.insert(child);
                    reached.add(child.state, child);
                    this.stylePosition(child.state.playerPosition, DisplaySetting.IN_FRONTIER);
                }
            });
        }

        return [];
    }


    /**
     * Blocks thread execution for some time.
     * @param time The number of milliseconds to pause for.
     */
    private pause(time: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, time));
    }


    /**
     * Sets the display setting for a cell to demonstrate the search process.
     * @param xyPosition The x-y position of the cell to style.
     * @param setting The display setting for the cell.
     */
    private stylePosition(xyPosition: [number, number], setting: DisplaySetting): void {
        const rcPosition: [number, number] = this.map.toRowColumn(xyPosition);
        const cellView: CellView = this.mapView.getCellView(rcPosition[0], rcPosition[1]);
        cellView.displaySetting = setting;
        cellView.update();
    }


    /**
     * Builds the action sequence from the start state to the state at the given goal node.
     * @param node The goal node at the end of the solution path.
     */
    private buildPath(node: Node): Action[] {
        const path: Action[] = [];
        
        while (null !== node.parent) {
            path.push(node.action!);
            this.stylePosition(node.state.playerPosition, DisplaySetting.IN_PATH);
            node = node.parent;
        }

        return path.reverse();
    }


    /**
     * Expands a node and finds all successor nodes.
     * @param node The node to expand.
     * @param A list of the successor nodes.
     */
    private expand(node: Node): Node[] {
        const children: Node[] = [];
        this.getActions(node.state).forEach((action: Action) => {
            const state: State = this.transition(node.state, action);
            const pathCost: number = node.pathCost + this.getActionCost(node.state, action, state);
            children.push(new Node(state, node, action, pathCost));
        });

        return children;
    }


    /**
     * Checks if a state is a goal state.
     * @param state The state to check for.
     * @returns True if the state is a goal, false if not.
     */
    private isGoal(state: State): boolean {
        const exitRowColumn: [number, number] = this.map.getExit().position;
        const exitXY: [number, number] = this.map.toXY(exitRowColumn);
        return state.playerPosition[0] === exitXY[0] && state.playerPosition[1] === exitXY[1];
    }


    /**
     * Gets the valid actions from a state.
     * @param state The state to take the action from.
     * @returns A list of the valid actions out of the given state.
     */
    private getActions(state: State): Action[] {
        const allActions: Action[] = [Action.up(), Action.down(), Action.left(), Action.right()];
        const validActions: Action[] = [];
        allActions.forEach((action: Action) => {
            const nextState: State = this.transition(state, action);

            // Validate the state
            const row: number = this.map.getHeight() - nextState.playerPosition[1] - 1;
            const column: number = nextState.playerPosition[0];
            if (this.map.contains(row, column) && this.map.getCell(row, column).canHavePlayer()) validActions.push(action);
        });

        return validActions;
    }


    /**
     * Gets the resulting state of a transition.
     * @param state The state to transition from.
     * @param action The action to take.
     * @returns The state resulting from the transition.
     */
    private transition(state: State, action: Action): State {
        return new State(action.applyTo(state.playerPosition));
    }


    /**
     * Gets the cost associated with a transition.
     * @param startState The state before the action.
     * @param action The action taken.
     * @param nextState The state after the action.
     * @returns The action cost of the transition.
     */
    private getActionCost(startState: State, action: Action, nextState: State): number {
        return 1;
    }
}