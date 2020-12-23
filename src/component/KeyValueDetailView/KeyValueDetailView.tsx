import {Table} from "antd";
import {SnapShot} from "../../model/store";

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
    }, {
        title: 'write_record',
        dataIndex: 'write_record',
        key: 'write_record',
    }];
    const data = Array.from(snapshot)
        .map(([key, [data, lock, write_record]]) => {
            return {key: key, data: data, lock: lock?.primary, write_record: write_record?.by_transaction}
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