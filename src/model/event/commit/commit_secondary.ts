import {AtomicEvent} from "../../atomicEvent";
import {Store} from "../../store";

export class CommitSecondary implements AtomicEvent {
    readonly typename = "CommitSecondary";
    constructor(
        public readonly transaction_id: number,
        public readonly commit_at_timestamp: number,
        public readonly timestamp: number,
        public readonly key: string) {
    }

    applyOnStore(store: Store): void {
        store.setWrite(this.commit_at_timestamp, this.key, {by_transaction: this.transaction_id});
        store.setLock(this.commit_at_timestamp, this.key, null);
    }

    get displayFields(): Array<{ name: string; value: string }> {
        return [
            {name: "key", value: this.key},
            {name: "commit_ts", value: this.commit_at_timestamp.toString()},
        ];
    }
}