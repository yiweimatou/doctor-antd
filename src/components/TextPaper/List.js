import React, {Component, PropTypes} from 'react';
import { Table, Popconfirm, Button } from 'antd'

class List extends Component {
    render() {
        const { list, total, loading, handleChange, handleConfirm, push } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            pageSize: 9,
            onChange: offset => handleChange(offset)
        }
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                return (<a href={`/textpaper/show?id=${record.id}`}>{text}</a>)
            }
        }, {
            title: '价格',
            dataIndex: 'sale_amount',
            key: 'sale_amount',
            render: text => `${text/100}元`
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 ? '正常': '冻结'
        }, {
            title: '操作',
            key: 'opreation',
            render: (text, record) =>
                    <div>
                        <Button type="ghost" onClick={() => this.props.onClick(record.id)}>发布到课程</Button>
                        <span className="ant-divider"></span>
                        <Button type = 'ghost' onClick={() => push(`/textpaper/edit/${record.id}`)}>编辑</Button>
                        <span className="ant-divider"></span>
                        <Popconfirm
                            title="确定要删除这个试卷吗？"
                            onConfirm={()=>handleConfirm(record.id)}
                        >
                            <Button type = 'ghost'>删除</Button>
                        </Popconfirm>
                    </div>
        }]
        return (
            <Table rowKey="id" dataSource={list} loading={loading} columns={columns} pagination = {{
                ...pagination,
                total
            }} />
        );
    }
}

List.propTypes = {
    handleChange: PropTypes.func,
    handleConfirm: PropTypes.func,
    loading: PropTypes.bool,
    list: PropTypes.array,
    total: PropTypes.number,
    push: PropTypes.func.isRequired
};

export default List;
