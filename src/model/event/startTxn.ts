import {AtomicEvent} from "../atomicEvent";
import {Store} from "../store";

export class StartTxnRequest implements AtomicEvent {
    readonly typename = "StartTxnRequest";
    constructor(public readonly transaction_id: number) {
    }

    get timestamp(): number {
        return this.transaction_id
    }

    applyOnStore(store: Store): void {
    }

    get displayFields(): Array<{ name: string; value: string }> {
        return [
            {name: "timestamp", value: this.timestamp.toString()},
        ];
    }
}