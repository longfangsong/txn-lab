import "./GroupEventView.css";
import {GroupEvent} from "../../model/atomicEvent";
import {AtomicEventView} from "../AtomicEventView/AtomicEventView";
import {MouseEventHandler} from "react";

export function GroupEventView({
                                   events,
                                   onMouseEnter,
                                   onMouseLeave
                               }: { events: GroupEvent, onMouseEnter: MouseEventHandler<HTMLDivElement>, onMouseLeave: MouseEventHandler<HTMLDivElement> }) {
    return (
        <>
            {events.atomics.map((event) => <AtomicEventView event={event}
                                                            key={"atom-" + event.timestamp}
                                                            onMouseEnter={onMouseEnter}
                                                            onMouseLeave={onMouseLeave}/>
            )}
            {events.atomics.map((endAt, index) => {
                if (index === 0) return <></>;
                const startAt = events.atomics[index - 1];
                return <div className={"event-group-link"}
                            key={"line-" + startAt.timestamp}
                            style={{
                                left: `calc(${startAt.timestamp}% + 9px)`,
                                width: `calc(${endAt.timestamp - startAt.timestamp}% - 8px)`
                            }}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                />
            })}
        </>
    )
}