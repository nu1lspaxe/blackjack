class PublishSubscribe {
    private static instance: PublishSubscribe;
    private subscribers: { [key: string]: Function[] } = {};

    private constructor() {}

    public static getInstance(): PublishSubscribe {
        if (!PublishSubscribe.instance) {
            PublishSubscribe.instance = new PublishSubscribe();
        }

        return PublishSubscribe.instance;
    }

    public subscribe(event: string, callback: Function): void {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }

        this.subscribers[event].push(callback);
    }

    public unsubscribe(event: string, callback: Function): void {
        if (!this.subscribers[event]) {
            return;
        }

        this.subscribers[event] = this.subscribers[event].filter(subscriber => subscriber !== callback);
    }

    public publish(event: string, data: any): void {
        if (!this.subscribers[event]) {
            return;
        }

        this.subscribers[event].forEach(callback => {
            callback(data);
        });
    }
}

export default PublishSubscribe;