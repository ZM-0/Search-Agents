/**
 * A subscriber to notifications from a publisher.
 */
export interface Subscriber {
    update: () => void;
}