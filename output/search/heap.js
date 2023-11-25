/**
 * A minimum binary heap for storing and ordering nodes.
 */
export class MinimumHeap {
    /**
     * The heap array.
     */
    values = [];
    /**
     * The function to evaluate and order nodes.
     */
    evaluate;
    /**
     * Creates an empty minimum heap.
     * @param evaluate A function to evaluate and order nodes.
     */
    constructor(evaluate) {
        this.evaluate = evaluate;
    }
    /**
     * Gets the heap size.
     * @returns The number of items in the heap.
     */
    size() {
        return this.values.length;
    }
    /**
     * Inserts an item in the heap.
     * @param node The node to insert in the heap.
     */
    insert(node) {
        this.values.push(node);
        this.lift(this.size() - 1);
    }
    /**
     * Removes the smallest item from the heap.
     * @returns The heap node with the smallest value, or undefined if there are no more items.
     */
    getMinimum() {
        this.swap(0, this.size() - 1);
        const value = this.values.pop();
        this.sink(0);
        return value;
    }
    /**
     * Lifts a heap item by swapping it with its parent until the heap order is maintained.
     * @param index The index of the item to lift.
     */
    lift(index) {
        let parent = Math.floor((index - 1) / 2);
        while (-1 !== parent) {
            if (this.evaluate(this.values[parent]) <= this.evaluate(this.values[index]))
                break;
            ;
            this.swap(parent, index);
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }
    /**
     * Sinks a heap item by swapping it with its smallest child until the heap order is maintained.
     * @param index The index of the item to sink.
     */
    sink(index) {
        let smallestChild = this.getSmallestChild(index);
        while (null !== smallestChild) {
            if (this.evaluate(this.values[smallestChild]) >= this.evaluate(this.values[index]))
                break;
            this.swap(smallestChild, index);
            index = smallestChild;
            smallestChild = this.getSmallestChild(index);
        }
    }
    /**
     * Gets the index of the child with the smallest value.
     * @param parent The index of the parent item.
     * @returns The index of the smallest child, or null if there are no children.
     */
    getSmallestChild(parent) {
        const firstChild = 2 * parent + 1;
        const secondChild = firstChild + 1;
        if (this.values.length <= firstChild)
            return null;
        else if (this.values.length <= secondChild ||
            this.evaluate(this.values[firstChild]) < this.evaluate(this.values[secondChild])) {
            return firstChild;
        }
        else
            return secondChild;
    }
    /**
     * Swaps two items in the heap.
     * @param index1 The index of the first item.
     * @param index2 The index of the second item.
     */
    swap(index1, index2) {
        const buffer = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = buffer;
    }
}
