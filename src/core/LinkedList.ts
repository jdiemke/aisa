import { Node } from './Node';

// https://en.wikipedia.org/wiki/Doubly_linked_list
export class LinkedList {

    length: number;
    head: Node;
    tail: Node;

    constructor() {
        this.length = 0;
        this.head = new Node(null);
        this.tail = new Node(null);
    }

    isEmpty() {
        return this.length === 0;
    }

    toArray(): Array<any> {
        const array: Array<any> = [];
        for (let i = 0, l = this.length; i < l; i++) {
            array.push(this.getData(i));
        }
        return array;
    }

    push(data: any): void {

        const node = new Node(data);

        if (this.isEmpty()) {
            this.head = this.tail = node;
            this.length++;
        }
        else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
            this.length++;
        }

    }

    findIndex(data: any): number {

        if (data !== null) {
            let tempIndex: number = 0;
            let tempNode: Node = this.head;

            while (tempIndex < this.length) {
                if (tempNode.data === data) {
                    return tempIndex;
                }
                else {
                    tempNode = tempNode.next;
                    tempIndex++;
                }
            }
        }
        return -1;

    }

    removeByIndex(i: number): void {
        this.removeByData(this.getData(i));
    }

    getData(i: number): any {

        if (typeof i === 'number' && i < this.length) {
            let tempNode: Node;
            let temp: number;
            if (i > (this.length / 2)) {
                temp = this.length;
                tempNode = this.tail;
                while (temp-- > i) {
                    tempNode = tempNode.prev
                }
                return tempNode.data;
            }
            else {
                temp = 0;
                tempNode = this.head;
                while (temp++ < i) {
                    tempNode = tempNode.next;
                }
                return tempNode.data;
            }
        }

    }

    getNode(i: number): Node {

        if (typeof i === 'number' && i < this.length) {
            let tempNode: Node;
            let temp: number;
            if (i > (this.length / 2)) {
                temp = this.length;
                tempNode = this.tail;
                while (temp-- > i) {
                    tempNode = tempNode.prev
                }
                return tempNode;
            }
            else {
                temp = 0;
                tempNode = this.head;
                while (temp++ < i) {
                    tempNode = tempNode.next;
                }
                return tempNode;
            }
        }

    }

    removeByData(data: any): void {

        let tempNode: Node;
        if (!data) return;
        if (data === this.head.data) {
            this.head = this.head.next;
        }
        if (data === this.tail.data) {
            tempNode = this.tail.prev;
            this.tail = tempNode;
        }
        else {
            tempNode = this.head;
            while (tempNode && tempNode.data !== data) {
                tempNode = tempNode.next;
            }
            if (tempNode.hasPrev())
                tempNode.prev.next = tempNode.next;
            if (tempNode.hasNext())
                tempNode.next.prev = tempNode.prev;
        }
        this.length--;

    }
}