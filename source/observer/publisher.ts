import { Subscriber } from "./subscriber.js";


/**
 * A base class for publishers which notify other objects of changes in its own state.
 */
export class Publisher {
    /**
     * A list of the subscribers.
     */
    private readonly subscribers: Subscriber[] = [];


    /**
     * Creates a new publisher.
     */
    constructor() {

    }


    /**
     * Adds a subscriber to be notified of events.
     * @param subscriber The subscriber to register.
     */
    public subscribe(subscriber: Subscriber): void {
        this.subscribers.push(subscriber);
    }


    /**
     * Removes a subscriber to no longer be notified of events.
     * @param subscriber The subscriber to be unsubscribed.
     */
    public unsubscribe(subscriber: Subscriber): void {
        this.subscribers.splice(this.subscribers.findIndex((value: Subscriber) => value === subscriber), 1);
    }


    /**
     * Notifies all subscribers of an event.
     */
    protected notify(): void {
        this.subscribers.forEach((subscriber: Subscriber) => subscriber.update());
    }
}