import { Node, State } from "./utilities.js";


/**
 * A hashtable to store reached states in a search process.
 */
export class Hashtable {
    /**
     * The table of value nodes.
     */
    private readonly table: (Node | null)[];


    /**
     * The maximum value of a component of an (x, y) position.
     */
    private readonly maximumValue: number;


    /**
     * The prime number used in the polynomial hashing.
     */
    private readonly prime: number;


    /**
     * Creates a hashtable.
     * @param mapHeight The map height in cells.
     * @param mapWidth The map width in cells.
     */
    constructor(mapHeight: number, mapWidth: number) {
        this.maximumValue = Math.max(mapHeight, mapWidth);
        const size: number = (mapWidth - 1) * this.maximumValue + (mapHeight - 1) + 1;
        this.prime = this.getPrime(size);
        this.table = new Array(size);
    }


    /**
     * Generates the next prime number larger than the hashtable size.
     * @param size The hashtable size.
     * @returns The next prime number larger than the hashtable size.
     */
    private getPrime(size: number): number {
        let candidate: number = size + 1;
        let prime: number | null = null;

        while (null === prime) {
            let isPrime: boolean = true;

            for (let i: number = 2; i <= Math.floor(Math.sqrt(candidate)); i++) {
                if (0 === candidate % i) {
                    isPrime = false;
                    break;
                }
            }

            if (isPrime) return candidate;
            else candidate++;
        }

        return -1;   // Indicates error
    }


    /**
     * Hashes a state to a hashtable index using polynomial hashing of the player position.
     * @param state The state to hash.
     */
    private hash(state: State): number {
        return state.playerPosition[0] * this.maximumValue + state.playerPosition[1];//) % this.prime) % this.table.length;
    }


    /**
     * Inserts a key state and value node in the hashtable.
     * @param key The state to be used as the key.
     * @param value The node to be stored as the value.
     */
    public add(key: State, value: Node): void {
        let hashValue: number = this.hash(key);
        // let probeCount: number = 0;

        // while (!this.table[hashValue] && this.table.length > probeCount) {
        //     hashValue = (hashValue++) % this.table.length;
        //     probeCount++;
        // }

        this.table[hashValue] = value;
    }


    /**
     * Checks if an entry with the given key is present.
     * @param key The state to be used as the key.
     * @returns True if there is an entry for the key, false if not.
     */
    public has(key: State): boolean {
        return this.table[this.hash(key)] ? true : false;
    }


    /**
     * Gets the node value associated with a state key.
     * @param key The state to be used as the key.
     * @returns The node entry for the key or null if there is no entry for the key.
     */
    public get(key: State): Node | null {
        return this.has(key) ? this.table[this.hash(key)] : null;
    }


    /**
     * Removes a value associated with a key.
     * @param key The state to be used as the key.
     */
    public remove(key: State): void {
        if (this.has(key)) this.table[this.hash(key)] = null;
    }
}