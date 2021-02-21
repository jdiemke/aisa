export class Node {

    data: any;
    next: Node;
    prev: Node;

    constructor(data: any) {
        this.data = data;
        this.next = this.next;
        this.prev = this.prev;
    }

    hasPrev(): boolean {
        return this.prev !== null;
    }

    hasNext(): boolean {
        return this.next !== null;
    }

}