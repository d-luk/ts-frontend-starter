export default class Greeter {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    public get greeting() {
        return `Hello, ${this.name}!`;
    }
}
