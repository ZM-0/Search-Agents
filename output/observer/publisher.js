/**
 * A base class for publishers which notify other objects of changes in its own state.
 */
export class Publisher {
    /**
     * A list of the subscribers.
     */
    subscribers = [];
    /**
     * Creates a new publisher.
     */
    constructor() {
    }
    /**
     * Adds a subscriber to be notified of events.
     * @param subscriber The subscriber to register.
     */
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
    /**
     * Removes a subscriber to no longer be notified of events.
     * @param subscriber The subscriber to be unsubscribed.
     */
    unsubscribe(subscriber) {
        this.subscribers.splice(this.subscribers.findIndex((value) => value === subscriber), 1);
    }
    /**
     * Notifies all subscribers of an event.
     */
    notify() {
        this.subscribers.forEach((subscriber) => subscriber.update());
    }
}
