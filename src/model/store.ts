import {Lock} from "./lock";
import {WriteRecord} from "./writeRecord";
import * as _ from "lodash";

export function latest<T>(m: Map<number, T>): [number, T] | undefined {
    return _.maxBy(Array.from(m), ([ts, _]) => ts)
}

export function atTimestamp<T>(m: Map<number, T> | undefined, timestamp: number): [number, T] | undefined {
    if (m === undefined) {
        return undefined;
    }
    return _.maxBy(Array.from(m).filter(([ts, _]) => ts <= timestamp), ([ts, _]) => ts)
}

export function afterTimestamp<T>(m: Map<number, T>, timestamp: number): Map<number, T> {
    return new Map(Array.from(m).filter(([ts, _]) => ts > timestamp))
}

export function allNotNull<T>(m: Map<number, T | null>): Array<[number, T]> {
    return Array.from(m).filter(([_, item]) => item !== null) as Array<[number, T]>;
}

export type SnapShot = Map<string, [string, Lock | null, WriteRecord | null]>;
export class Store {
    constructor() {
        this.data = new Map();
        this.lock = new Map();
        this.write = new Map();
    }

    // key -> timestamp -> value
    public data: Map<string, Map<number, string>>;
    public lock: Map<string, Map<number, Lock | null>>;
    public write: Map<string, Map<number, WriteRecord | null>>;

    public setData(timestamp: number, key: string, value: string) {
        if (!this.data.has(key)) {
            this.data.set(key, new Map());
        }
        this.data.get(key)!.set(timestamp, value)
    }

    public setLock(timestamp: number, key: string, value: Lock | null) {
        if (!this.lock.has(key)) {
            this.lock.set(key, new Map());
        }
        this.lock.get(key)!.set(timestamp, value)
    }

    public setWrite(timestamp: number, key: string, value: WriteRecord | null) {
        if (!this.write.has(key)) {
            this.write.set(key, new Map());
        }
        this.write.get(key)!.set(timestamp, value)
    }

    public snapshot(timestamp: number): SnapShot {
        let result = new Map();
        let keys = Array.from(this.data.keys());
        keys.push(...Array.from(this.lock.keys()));
        keys.push(...Array.from(this.write.keys()));
        keys = keys.sort();
        keys = _.sortedUniq(keys);
        for (const key of keys) {
            let dataItem = this.data.get(key);
            const value = atTimestamp(dataItem, timestamp) || [0, ""];
            let lockItem = this.lock.get(key);
            const lock = atTimestamp(lockItem, timestamp) || [0, null];
            let writeItem = this.write.get(key);
            const write = atTimestamp(writeItem, timestamp) || [0, null];
            result.set(key, [value[1], lock[1], write[1]]);
        }
        return result;
    }
}