import * as _ from 'lodash'
import {AtomicEvent, GroupEvent} from "../../atomicEvent";
import {CommitPrimary} from "./commit_primary";
import {CommitSecondary} from "./commit_secondary";
import {Store} from "../../store";

export class Commit implements AtomicEvent, GroupEvent {
    readonly typename = "Commit";
    constructor(
        public readonly transaction_id: number,
        public readonly keys: Array<string>,
        public readonly primary_lock_on_key: string,
        public readonly timestamp: number,
        commitPrimaryTimestamp?: number,
        commitSecondariesTimestamps?: Array<number>
    ) {
        let maxAllocatedTimestamp = timestamp;
        if (commitPrimaryTimestamp !== undefined) {
            this.commitPrimary = new CommitPrimary(transaction_id, timestamp, commitPrimaryTimestamp, primary_lock_on_key);
        } else {
            maxAllocatedTimestamp++;
            this.commitPrimary = new CommitPrimary(transaction_id, timestamp, maxAllocatedTimestamp, primary_lock_on_key);
        }
        if (commitSecondariesTimestamps !== undefined) {
            this.commitSecondaries = _.zip(keys, commitSecondariesTimestamps).map(
                ([key, prewriteSecondaryTimestamp]) => (
                    new CommitSecondary(transaction_id, prewriteSecondaryTimestamp!, timestamp, key!)
                )
            );
        } else {
            maxAllocatedTimestamp++;
            this.commitSecondaries = keys
                .filter(it => it !== primary_lock_on_key)
                .map((key, index) =>
                    new CommitSecondary(transaction_id, timestamp, maxAllocatedTimestamp + index, key!)
                );
        }
        this.commitSecondaries.sort((a, b) => a.timestamp - b.timestamp);
    }

    private readonly commitPrimary: CommitPrimary;
    private readonly commitSecondaries: Array<CommitSecondary>;

    get atomics(): Array<AtomicEvent> {
        return [this, this.commitPrimary, ...this.commitSecondaries];
    }

    applyOnStore(store: Store): void {
    }

    get displayFields(): Array<{ name: string; value: string }> {
        return [
            {name: "primary key", value: this.primary_lock_on_key}
        ];
    }
}