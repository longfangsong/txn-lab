import {AtomicEvent} from "../../atomicEvent";
import {Store} from "../../store";

export class PrewriteSecondary implements AtomicEvent {
    readonly typename = "PrewriteSecondary";
    constructor(
        public readonly timestamp: number,
        public readonly transaction_id: number,
        public readonly key: string,
        public readonly value: string,
        public readonly primary: string) {
    }

    applyOnStore(store: Store): void {
        store.setData(this.transaction_id, this.key, this.value);
        store.setLock(this.transaction_id, this.key, {by_transaction: this.transaction_id, primary: this.primary});
    }

    get displayFields(): Array<{ name: string; value: string }> {
        return [
            {name: "key", value: this.key},
            {name: "value", value: this.value},
        ];
    }
}