import {AtomicEvent, GroupEvent} from "../../atomicEvent";
import {Mutation} from "../../mutation";
import {PrewritePrimary} from "./prewrite_primary";
import {PrewriteSecondary} from "./prewrite_secondary";
import * as _ from 'lodash'
import {Store} from "../../store";

export class Prewrite implements AtomicEvent, GroupEvent {
    readonly typename = "Prewrite";
    constructor(
        public readonly transaction_id: number,
        public readonly mutations: Array<Mutation>,
        public readonly primary_lock_on_key: string,
        public readonly timestamp: number,
        prewritePrimaryTimestamp?: number,
        prewriteSecondariesTimestamps?: Array<number>,
    ) {
        let maxAllocatedTimestamp = timestamp;
        if (prewritePrimaryTimestamp !== undefined) {
            this.prewritePrimary = new PrewritePrimary(
                prewritePrimaryTimestamp,
                transaction_id,
                primary_lock_on_key,
                mutations.find(it => it.key === primary_lock_on_key)!.value
            );
        } else {
            maxAllocatedTimestamp++;
            this.prewritePrimary = new PrewritePrimary(
                maxAllocatedTimestamp,
                transaction_id,
                primary_lock_on_key,
                mutations.find(it => it.key === primary_lock_on_key)!.value
            );
        }
        if (prewriteSecondariesTimestamps !== undefined) {
            this.prewriteSecondaries = _.zip(mutations, prewriteSecondariesTimestamps).map(
                ([mutation, prewriteSecondaryTimestamp]) => (
                    new PrewriteSecondary(
                        prewriteSecondaryTimestamp!,
                        transaction_id,
                        mutation!.key,
                        mutation!.value,
                        primary_lock_on_key)
                )
            );
        } else {
            maxAllocatedTimestamp++;
            this.prewriteSecondaries = mutations
                .filter(it => it.key !== primary_lock_on_key)
                .map((mutation, index) =>
                    new PrewriteSecondary(maxAllocatedTimestamp + index, transaction_id, mutation.key,
                        mutation.value, primary_lock_on_key)
                );
        }
    }

    private readonly prewritePrimary: PrewritePrimary;
    private readonly prewriteSecondaries: Array<PrewriteSecondary>;

    get atomics(): Array<AtomicEvent> {
        return [this, this.prewritePrimary, ...this.prewriteSecondaries];
    }

    applyOnStore(store: Store): void {
    }

    get displayFields(): Array<{ name: string; value: string }> {
        return [
            {name: "primary", value: this.primary_lock_on_key}
        ];
    }
}