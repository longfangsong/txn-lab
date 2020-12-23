import "./Timeline.css"
import {AtomicEvent, GroupEvent, isAtomic} from "../../model/atomicEvent";
import {AtomicEventView} from "../AtomicEventView/AtomicEventView";
import {GroupEventView} from "../GroupEventView/GroupEventView";
import {Session} from "../../model/session";
import CSS from 'csstype';
import {useRef, useState} from "react";
import * as _ from "lodash";
import {KeyValueDetail} from "../KeyValueDetailView/KeyValueDetailView";
import {Store} from "../../model/store";

function TransactionLine({
                             transaction,
                             style
                         }: { transaction: Array<AtomicEvent | GroupEvent>, style: CSS.Properties }) {
    return <div style={style}>
        <div className={"event-line-top"} style={{
            left: `${transaction[0].timestamp}%`,
            width: `${transaction[transaction.length - 1].timestamp - transaction[0].timestamp}%`
        }}/>
        {transaction.map(request => <div key={"event-line-" + request.timestamp} className={"event-line"}
                                         style={{left: `${request.timestamp}%`}}/>)}
    </div>
}

export default function Timeline({session, style}: { session: Session, style?: CSS.Properties }) {
    const [txnSelected, setTxnSelected] = useState<number | null>(null);
    const [currentViewingTime, setCurrentViewingTime] = useState(0);
    const element = useRef(null);
    const store = (() => {
        let store = new Store();
        for (let event of session.events) {
            if (isAtomic(event)) {
                if (event.timestamp <= currentViewingTime) {
                    event.applyOnStore(store)
                }
            } else {
                for (const sub of event.atomics) {
                    if (sub.timestamp <= currentViewingTime) {
                        sub.applyOnStore(store)
                    }
                }
            }
        }
        return store;
    })()
    let handleMouseMove = _.throttle((e) => {
        let elem = element.current as any as HTMLDivElement;
        let offset = e.clientX - elem.offsetLeft;
        setCurrentViewingTime(offset / elem.offsetWidth * 100)
    }, 100, {'trailing': true});

    return <div className={"timeline-wrapper"} style={style}>
        <div className={"transaction-bar"}>
            {
                Array.from(session.transactions)
                    .map(it => <TransactionLine key={it[0].transaction_id}
                                                transaction={it}
                                                style={{opacity: it[0].transaction_id === txnSelected ? '100%' : '5%'}}
                        />
                    )
            }
        </div>
        <div className={"timeline"} ref={element} onMouseMove={handleMouseMove}>
            <div className={"rails"}/>
            {session.events.map(event => isAtomic(event) ?
                <AtomicEventView event={event}
                                 key={"atomic-ev-" + event.timestamp}
                                 onMouseEnter={() => setTxnSelected(event.transaction_id)}
                                 onMouseLeave={() => setTxnSelected(null)}
                /> :
                <GroupEventView events={event}
                                key={"group-ev-" + event.timestamp}
                                onMouseEnter={() => setTxnSelected(event.transaction_id)}
                                onMouseLeave={() => setTxnSelected(null)}
                />
            )}
            <div className={"cursor"} style={{
                left: `${currentViewingTime}%`,
                zIndex: -1
            }}/>
        </div>
        <KeyValueDetail snapshot={store.snapshot(currentViewingTime)}/>
    </div>
}