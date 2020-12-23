import {AtomicEvent, GroupEvent} from "./atomicEvent";

export class Session {
    constructor(public events: Array<AtomicEvent | GroupEvent> = []) {
    }

    get transactions(): Array<Array<AtomicEvent | GroupEvent>> {
        let result = new Map();
        for (const request of this.events) {
            if (result.has(request.transaction_id)) {
                result.get(request.transaction_id)!.push(request)
            } else {
                result.set(request.transaction_id, [request])
            }
        }
        return Array.from(result.values())
    }
}