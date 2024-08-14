import { IItem, IToDoModel } from "../types";
import { EventEmitter } from "./EventEmitter";

export class ToDoModel extends EventEmitter implements IToDoModel{
    protected _items: IItem[]

    constructor() {
        super();
        this._items = [];
    }

    set items(data: IItem[]) {
        this._items = data;
        this.emit('changed');
    }

    get items() {
        return this._items;
    }

    addItem (data: string)  {
        const uniqueId: number = Math.max(...this._items.map(item => Number(item.id))) + 1;
        const newItem: IItem = {id: String(uniqueId), name: data};
        this._items.push(newItem)
        this.emit('changed');
        return newItem
    };

    removeItem (id: string) {
        this._items = this._items.filter(item => item.id !== id)
        this.emit('changed');
    }

    editItem (id: string, name: string) {
        const editedItem = this._items.find(item => item.id === id);
        editedItem.name = name;
        this.emit('changed');
    }
    
    getItem(id: string) {
        return this._items.find(item => item.id === id)
    }

}