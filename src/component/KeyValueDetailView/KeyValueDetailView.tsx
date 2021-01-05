import {Popover, Table} from "antd";
import {SnapShot} from "../../model/store";
import {LockFilled} from "@ant-design/icons";
import {Lock} from "../../model/lock";

function LockInfo({lock}: { lock: Lock }) {
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
        dataSource={[
            {name: "By Transaction", value: lock.by_transaction, key: "by_transaction"},
            {name: "Primary Key", value: lock.primary, key: "primary"},
        ]}
        pagination={{hideOnSinglePage: true}}
        showHeader={false}
        bordered={true}
        size={"small"}
    />)
}

export function KeyValueDetail({snapshot}: { snapshot: SnapShot }) {
    const columns = [{
        title: 'Key',
        dataIndex: 'key',
        key: 'key',
    }, {
        title: 'data',
        dataIndex: 'data',
        key: 'data',
    }, {
        title: 'lock',
        dataIndex: 'lock',
        key: 'lock',
        render: (lock: Lock | null) => {
            if (lock) {
                return (
                    <Popover content={<LockInfo lock={lock}/>} title="Lock Detail">
                        <LockFilled style={{color: "#2fb82f"}}/>
                    </Popover>)
            } else {
                return <></>
            }
        }
    }, {
        title: 'write_record',
        dataIndex: 'write_record',
        key: 'write_record',
    }];
    const data = Array.from(snapshot)
        .map(([key, [data, lock, write_record]]) => {
            return {key: key, data: data, lock: lock, write_record: write_record?.by_transaction}
        });
    return <Table
        columns={columns}
        dataSource={data}
        pagination={{hideOnSinglePage: true}}
        showHeader={true}
        bordered={true}
        size={"small"}
    />
}