import {Store} from "./store";

export interface AtomicEvent {
    readonly typename: string,
    readonly timestamp: number,
    readonly transaction_id: number

    // todo: figure out conflict
    applyOnStore(store: Store): void;

    readonly displayFields: Array<{ name: string, value: string }>
}

export interface GroupEvent {
    readonly atomics: Array<AtomicEvent>
    readonly timestamp: number,
    readonly transaction_id: number,
}

export function isAtomic(event: GroupEvent | AtomicEvent): event is AtomicEvent {
    return (event as GroupEvent).atomics === undefined;
}