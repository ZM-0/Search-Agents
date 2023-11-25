/**
 * A hashtable to store reached states in a search process.
 */
export class Hashtable {
    /**
     * The table of value nodes.
     */
    table;
    /**
     * The maximum value of a component of an (x, y) position.
     */
    maximumValue;
    /**
     * The prime number used in the polynomial hashing.
     */
    prime;
    /**
     * Creates a hashtable.
     * @param mapHeight The map height in cells.
     * @param mapWidth The map width in cells.
     */
    constructor(mapHeight, mapWidth) {
        this.maximumValue = Math.max(mapHeight, mapWidth);
        const size = mapHeight * mapWidth;
        this.prime = this.getPrime();
        this.table = new Array(size);
    }
    /**
     * Generates the next prime number larger than the hashtable size.
     * @returns The next prime number larger than the hashtable size.
     */
    getPrime() {
        let candidate = this.table.length + 1;
        let prime = null;
        while (null === prime) {
            let isPrime = true;
            for (let i = 2; i <= Math.floor(Math.sqrt(candidate)); i++) {
                if (0 === candidate % i) {
                    isPrime = false;
                    break;
                }
            }
            if (isPrime)
                return candidate;
            else
                candidate++;
        }
        return -1; // Indicates error
    }
    /**
     * Hashes a state to a hashtable index using polynomial hashing of the player position.
     * @param state The state to hash.
     */
    hash(state) {
        return ((state.playerPosition[0] * this.maximumValue + state.playerPosition[1]) % this.prime) % this.table.length;
    }
    /**
     * Inserts a key state and value node in the hashtable.
     * @param key The state to be used as the key.
     * @param value The node to be stored as the value.
     */
    add(key, value) {
        this.table[this.hash(key)] = value;
    }
    /**
     * Checks if an entry with the given key is present.
     * @param key The state to be used as the key.
     * @returns True if there is an entry for the key, false if not.
     */
    has(key) {
        return this.table[this.hash(key)] ? true : false;
    }
    /**
     * Gets the node value associated with a state key.
     * @param key The state to be used as the key.
     * @returns The node entry for the key or null if there is no entry for the key.
     */
    get(key) {
        return this.has(key) ? this.table[this.hash(key)] : null;
    }
    /**
     * Removes a value associated with a key.
     * @param key The state to be used as the key.
     */
    remove(key) {
        if (this.has(key))
            this.table[this.hash(key)] = null;
    }
}
