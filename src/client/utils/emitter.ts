

export type EmitMap = {
    [name: string]: any[]
};

export abstract class Emitter<T extends EmitMap = any> {
    public abstract getListners<K extends keyof T>(name: K): ((this: this, ...args: T[K]) => unknown)[];
    public abstract emit<K extends keyof T>(name: K, ...args: T[K]): void;
    public abstract listen<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void;
    public abstract unlisten<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void;
}

export class OrderedEmiiter<T extends EmitMap = any> extends Emitter<T> {
    private listeners: {
        [K in keyof T]?: ((this: this, ...args: T[K]) => unknown)[];
    }
    constructor() {
        super();
        this.listeners = {};
    }

    public getListners<K extends keyof T>(name: K): ((this: this, ...args: T[K]) => unknown)[] {
        return this.listeners[name] ?? [];
    }
    public emit<K extends keyof T>(name: K, ...args: T[K]): void;
    public emit(name: string, ...args: any[]): void;
    public emit<K extends keyof T>(name: K, ...args: T[K]): void {
        const listeners = this.listeners[name];
        if (!listeners) return;


        for (const listener of listeners)
            listener.apply(this, args);

        this.listeners[name] = listeners.filter(Boolean);
    }
    public listen<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void {
        this.appendListener(name, listener);
    }
    public prependListener<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void {
        const listeners = this.listeners[name];
        if (!listeners) 
            return void (this.listeners[name] = [listener]);
        listeners.unshift(listener);
    }
    public appendListener<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void {
        const listeners = this.listeners[name];
        if (!listeners) 
            return void (this.listeners[name] = [listener]);
        listeners.push(listener);
    }
    public unlisten<K extends keyof T>(name: K, listener: (this: this, ...args: T[K]) => unknown): void {
        const listeners = this.listeners[name];
        if (!listeners) return;
        const index = listeners.indexOf(listener);
        if (index === -1) return;
        delete listeners[index]
    }

}