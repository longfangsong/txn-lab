import "./AtomicEventView.css";
import {Popover, Table} from "antd";
import {AtomicEvent} from "../../model/atomicEvent";
import {MouseEventHandler} from "react";

function EventDetail({event}: { event: AtomicEvent }) {
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <b>{text}</b>,
    }, {
        title: 'value',
        dataIndex: 'value',
        key: 'value',
    }];
    return (<Table
        columns={columns}
        dataSource={event.displayFields.map(it => ({...it, key: it.name}))}
        pagination={{hideOnSinglePage: true}}
        showHeader={false}
        bordered={true}
        size={"small"}
    />)
}

export function AtomicEventView({
                                    event,
                                    onMouseEnter,
                                    onMouseLeave
                                }: { event: AtomicEvent, onMouseEnter: MouseEventHandler<HTMLDivElement>, onMouseLeave: MouseEventHandler<HTMLDivElement> }) {
    return (
        <Popover title={event.typename} content={EventDetail({event})}>
            <div className={"event"} style={{left: `${event.timestamp}%`}}
                 onMouseEnter={onMouseEnter}
                 onMouseLeave={onMouseLeave}
            />
        </Popover>
    )
}