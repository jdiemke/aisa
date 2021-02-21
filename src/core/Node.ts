/**
 * Node implementation class. A node is a vertex in the list which contains data and pointers to the next node and previous node.
 */
export class DLNode<T> {
    /**
     * The data contained in the node.
     */
    private _data: T | null = null;

    /**
     * The edge or pointer to the next node.
     */
    private _next: DLNode<T> | null = null;

    /**
     * The edge or pointer to the previous node.
     */
    private _previous: DLNode<T> | null = null;

    constructor() { }

    get data(): T | null {
        return this._data;
    }

    set data(data: T | null) {
        this._data = data;
    }

    get next(): DLNode<T> | null {
        return this._next;
    }

    set next(next: DLNode<T> | null) {
        this._next = next;
    }

    get previous(): DLNode<T> | null {
        return this._previous;
    }

    set previous(previous: DLNode<T> | null) {
        this._previous = previous;
    }
}