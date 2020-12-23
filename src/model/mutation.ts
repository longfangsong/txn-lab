export class Put {
    constructor(public key: string, public value: string) {
    }
}

export class Del {
    constructor(public key: string) {
    }

    get value() {
        return "";
    }
}

export type Mutation = Put | Del;