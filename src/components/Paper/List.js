import React, {Component} from 'react'
import { Table, message, Button } from 'antd'
import { getSection } from '../../services/section'
import { getLesson } from '../../services/lesson'
import { info, listAsync } from '../../services/paper'
import { get as getTopics } from '../../services/topics'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            topics: {},
            total: 0,
            lesson: '',
            tid: 0,
            loading: true
        }
        this.listHandler = this.listHandler.bind(this)
    }
    componentWillMount() {
        getSection({ id : this.props.location.query.id }).then(section => {
            if (section.get.id > 0) {
                getLesson({ id: section.get.lesson_id }).then(lesson => {
                    if (lesson.get.id > 0) {
                        this.setState({ lesson: lesson.get.title })
                    }
                })
                getTopics({ id: section.get.foreign_id }).then(topics => {
                    if (topics.get.id > 0) {
                        this.setState({ topics: topics.get })
                    }
                })
                this.setState({
                    tid: section.get.foreign_id
                })
            }
        })
        this.infoHandler()
    }

    infoHandler() {
        info({ section_id: this.props.location.query.id }).then(data => {
            if (data.count === 0) {
                this.setState({
                    total: 0,
                    loading: false
                })
            } else {
                this.setState({ total: data.count })
                this.listHandler(1)
            }
        })
    }

    listHandler(offset) {
        listAsync({
            limit: 9,
            offset,
            section_id: this.props.location.query.id
        }).then(data => {
            this.setState({
                list: data,
                loading: false
            })
        }).catch(error => {
            message.error(error)
            this.setState({
                loading: false
            })
        })
    }
    render() {
        const { total, list, topics, lesson, tid } = this.state
        const id = this.props.location.query.id
        const time = topics.add_ms ? (new Date(topics.add_ms * 1000)).toLocaleString(): ''
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 9,
            onChange: this.listHandler
        }
        const columns = [{
            title: '个人识别码',
            key: 'id_code',
            dataIndex: 'id_code'
        }, {
            title: '答题人',
            key: 'name',
            dataIndex: 'name'
        }, {
            title: '答对题数',
            dataIndex: 'right_num',
            key: 'right_num'
        }, {
            title: '答题时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }]
        return (
            <div>
                <div>
                    <span>课程名称： { lesson }</span>
                </div>
                <div>
                    <span>试卷标题： { topics.title }</span>
                </div>
                <div>
                    <span>发布时间： { time }</span>
                </div>
                <div>
                    <span>统计时间： { (new Date()).toLocaleString() }</span>
                </div>
                <div>
                    <span>测试人数： { total }</span>
                </div>
                <div style={{ margin: '20px 0' }}>
                    <Button disabled={total === 0}>
                        <a href={`http://yiweimatou.com:4000/excel?id=${id}&title=${topics.title}&tid=${tid}&lesson=${lesson}&time=${topics.add_ms*1000}&num=${total}`}>
                            导出统计结果
                        </a>
                    </Button>
                </div>
                <Table rowKey="id" pagination={pagination} columns={columns} dataSource={list}/>
            </div>
        );
    }
}

export default List
