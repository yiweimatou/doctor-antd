import React, {
    Component,
    PropTypes
} from 'react'
import {
    Table,Button,Modal
} from 'antd'
import { Link } from 'react-router'

class OrganizeLessonList extends Component {
    static propTypes = {
        list:PropTypes.object,
        edit:PropTypes.func,
        changeHandler:PropTypes.func
    }
    state = {
        lesson_name: '',
        money: 0,
        id: 0,
        visible: false
    }
    handleOpreation = (flag, id, name, money) =>{
        if(flag) {
            this.setState({
                lesson_name: name,
                money: money,
                id,
                visible: true
            })
        }else{
            this.props.edit(flag, id)        
        }
    }
    handleOk = () => {
        this.props.edit(true,this.state.id)
        this.setState({
            visible: false
        })
    }
    handleCancel = () => this.setState({
        visible: false
    })
    render(){
        const {
            list, changeHandler
        } = this.props
        const pagination = {
            total: list.total,
            defaultPageSize:list.params.limit,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                changeHandler(current,list.params.limit)
            }
        }
        const columns = [{
            title: '课程名称',
            dataIndex: 'lesson_name',
            key: 'lesson_name',
            render : (text, record) => (<Link to={`/lesson/show/${record.lesson_id}`}>{text}</Link>)
        },{
            title: '认证金额',
            dataIndex: 'organize_money',
            key: 'organize_money'
        }, {
            title:'申请时间',
            dataIndex:'add_ms',
            key:'add_ms',
            render:function(text){
                return new Date(text*1000).toLocaleString()
            }
        }, {
            title:'状态',
            key:'cet',
            dataIndex:'cet',
            render:(text)=>{
                switch (text) {
                    case 1:
                        return '未认证'
                    case 2:
                        return '认证中'
                    case 3:
                        return '认证失败'
                    case 4:
                        return '认证成功'
                    default:
                        return ''
                }
            }
        }, {
            title:'操作',
            key:'operation',
            render: (text,record)=>(
                record.cet<3?
                <div>
                    <Button 
                        type = 'ghost'
                        onClick={()=>this.handleOpreation(true,record.id,record.lesson_name,record.organize_money)}
                    >
                        同意
                    </Button>
                    <span className="ant-divider"></span>
                    <Button 
                        type = 'ghost'
                        onClick={()=>this.handleOpreation(false,record.id)}
                    >
                        拒绝
                    </Button>
                </div>:''
            )
        }]
        return (
            <div>
                <Modal
                    title='认证费用'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>
                        课程名称:{this.state.lesson_name}
                    </p>
                    <p>
                        认证费用:
                        <em style={{color:'orange',fontSize:'200%'}}>
                            {this.state.money}
                        </em>元
                    </p>
                </Modal>
                <Table
                    dataSource={list.data}
                    columns = { columns } 
                    pagination = { pagination }
                />
            </div>
        )
    }
}

export default OrganizeLessonList