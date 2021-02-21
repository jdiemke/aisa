import { DLNode } from './Node';

/**
 * Doubly Linked-List implementation class.
 * https://en.wikipedia.org/wiki/Doubly_linked_list
 * https://github.com/DameLyngdoh/dl-doubly-linked-list-ts
 *
 */
export class DoublyLinkedList<T> {
    /**
     * The start node of the list.
     */
    private _start: DLNode<T> | null;

    /**
     * The last  node of the list.
     */
    private _end: DLNode<T> | null;

    /**
     * The number of nodes in the list.
     */
    private _length: number;

    constructor() {
        this._start = null;
        this._end = null;
        this._length = 0;
    }

    get start(): DLNode<T> | null {
        return this._start;
    }

    set start(start: DLNode<T> | null) {
        this._start = start;
    }

    get end(): DLNode<T> | null {
        return this._end;
    }

    set end(end: DLNode<T> | null) {
        this._end = end;
    }

    get length(): number {
        return this._length + 1;
    }

    /**
     * Returns true if the list is empty.
     * @returns Returns true if list is empty or false otherwise.
     */
    public isEmpty(): boolean {
        return this.length === 0;
    }

    /**
     * Inserts a node to the start of the list.
     * @param node The node to be inserted to the list.
     */
    public insertStart(node: DLNode<T>): void {
        if (this.isEmpty()) {
            this.start = node;
            this.end = node;
        }
        else {
            node.next = this.start;
            if (this.start != null) {
                this.start.previous = node;
            }
            this.start = node;
        }
        this._length++;
    }

    /**
     * Inserts a node to the end of the list.
     * @param node The node to be inserted to the list.
     */
    public insertEnd(node: DLNode<T>): void {
        if (this.isEmpty()) {
            this.start = node;
            this.end = node;
        }
        else {
            node.previous = this.end;
            if (this.end != null) {
                this.end.next = node;
            }
            this.end = node;
        }
        this._length++;
    }

    /**
     * Inserts a node at the specified index in the list.
     * @param node The node to be inserted to the list.
     * @param index The index to insert the node at. A value of -1 will insert the node to the end of the list.
     */
    public insert(node: DLNode<T>, index: number): void {
        if (index === 0) {
            this.insertStart(node);
            return;
        }
        else if (index === -1) {
            this.insertEnd(node);
            return;
        }

        let currentNode = this.start;
        let i: number = 0;
        for (i = 0; i < index - 1 && currentNode !== null; i++) {
            currentNode = currentNode.next;
        }

        // Insertion not possible
        if (i !== index - 1 && currentNode === null) {
            return;
        }

        if (currentNode != null) {
            node.previous = currentNode;
            node.next = currentNode.next;
            if (currentNode.next != null) {
                currentNode.next.previous = node;
            }
            else {
                this.end = node;
            }
            currentNode.next = node;
        }
        this._length++;
    }

    /**
     * Deletes the first node from the list.
     */
    public deleteStart(): void {
        if (this.isEmpty()) {
            return;
        }

        if (this.start != null && this.start.next == null) {
            this.start = null;
            this.end = null;
        }
        else if (this.start != null) {
            this.start = this.start.next;
            if (this.start != null) {
                this.start.previous = null;
            }
        }
        this._length--;
    }

    /**
     * Deletes the last node from the list.
     */
    public deleteEnd(): void {
        if (this.isEmpty()) {
            return;
        }

        if (this.end != null && this.end.previous == null) {
            this.start = null;
            this.end = null;
        }
        else if (this.end != null) {
            this.end = this.end.previous;
            if (this.end != null) {
                this.end.next = null;
            }
        }
        this._length--;
    }

    /**
     * Deletes a node from a specific index in the list. If the index is out of bounds, then no deletion will occur.
     * @param index The index of the node to be deleted.
     */
    public delete(index: number): void {
        if (this.isEmpty()) {
            return;
        }
        if (index === 0) {
            this.deleteStart();
            return;
        }
        else if (index === -1) {
            this.deleteEnd();
            return;
        }

        const node = this.getNode(index);
        if (node != null) {
            if (node.next === null && node.previous !== null) {
                this.deleteEnd();
            }
            else if (node.previous === null && node.next !== null) {
                this.deleteStart();
            }
            else if (node.next !== null && node.previous !== null) {
                node.previous.next = node.next;
                node.next.previous = node.previous;
                this._length--;
            }
        }
    }

    /**
     * Retrieves a node from the specific index.
     * @param index The index from which to retrieve the node.
     * @returns Returns the node at the specific index or null if the index is out of bounds.
     */
    public getNode(index: number): DLNode<T> | null {
        if (this.isEmpty() || index < 0) {
            return null;
        }

        let currentNode = this.start;
        for (let i = 1; i <= index && currentNode != null; i++) {
            currentNode = currentNode.next;
        }

        return currentNode;
    }

    /**
     * Returns an array of the nodes in the order of the list.
     * @returns Array of nodes.
     */
    public toArray(): Array<DLNode<T>> {
        const array: Array<DLNode<T>> = new Array<DLNode<T>>();

        if (this.length === 0) {
            return array;
        }

        let i = 0;

        let currentNode: DLNode<T> | null = this.start;
        while (currentNode != null && i < 12) {
            array.push(currentNode);
            currentNode = currentNode.next;
            i++;
        }
        return array;
    }

    /**
     * Clears the list and deletes all nodes.
     */
    public clear(): void {
        this.end = null;
        this.start = null;
        this._length = 0;
    }
}