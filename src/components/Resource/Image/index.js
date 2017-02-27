import React, {Component, PropTypes} from 'react';
import './styles/index.css'
import { Button, message, Spin, Modal, Col, Pagination, Row, Form, Input } from 'antd'
import { IMAGE } from '../../../constants/api'
import { add as grow } from '../../../services/grow'
import { remove } from '../../../services/source'
import ImageCard from './ImageCard'
import ImageUpload from './ImageUpload'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
class Image extends Component {
    state = {
        total: 0,
        list: [],
        loading: true,
        visible: false,
        pending: false,
        editVisible: false,
        item: {}
    }
    componentWillMount() {
        const {info, list} = this.props
        info({state: 1, category_id: IMAGE})
            .then(data => this.setState({total: data.count}))
            .catch(error => message.error(error))
        list({state: 1, limit: 9, offset: 1, category_id: IMAGE})
            .then(data => this.setState({list: data.list, loading: false}))
            .catch(error => message.error(error))
    }
    _onCancel = () => this.setState({visible: false})
    _edit = image => {
        return this.props.edit(image).then(() => {
            this.setState(prevState => ({
                list: prevState.list.map(v => {
                    if (v.id === image.id) {
                        return {
                            ...v,
                            title:image.title,
                            descript: image.descript
                        }
                    }
                    return v
                }),
                editVisible: false
            }))
        })
    }
    _remove = id => {
        Modal.confirm({
            onOk: () => {
                remove({ id }).then(() => {
                    this.setState({ 
                        list: this.state.list.filter(i => i.id !== id)
                    })
                    message.success('删除成功!')
                }).catch(error => message.error(error))
            },
            title: '确认',
            content: '是否删除？'
        })
        
    }
    visibleToggle = () => this.setState(prevState => ({
        editVisible: !prevState.editVisible
    }))
    submitHandler = e => {
        e.preventDefault
        this.props.form.validateFields((erros, values) => {
            if (erros) return
            this.setState({
                pending: true
            })
            this._edit({
                id: this.state.item.id,
                title: values.title,
                descript: values.descript,
            }).catch(err => {
                message.error(err)
                this.setState({ pending: false })
            })
        })
    }
    render() {
        const {loading, total, list, visible} = this.state    
        const { getFieldDecorator } = this.props.form    
        return (
            <Spin spinning={loading}>
                <Modal visible={visible} title='新增图片' footer='' width={720} onCancel={this._onCancel}>
                    <ImageUpload add={this.props.add} hideModal={image => this.setState({
                        visible: false,
                        list: [image].concat(this.state.list),
                        total: this.state.total + 1
                    })} grow={grow}/>
                </Modal>
                <Modal title="编辑" visible={this.state.editVisible} onCancel={this.visibleToggle} footer={null}>
                    <Form onSubmit={this.submitHandler}>
                        <FormItem {...formItemLayout} label='图片名称' hasFeedback>
                            {getFieldDecorator('title',{
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请填写图片名称'
                                }],
                                initialValue: this.state.item.title
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label='描述'>
                            {getFieldDecorator('descript', { initialValue: this.state.item.descript})(<Input type='textarea' rows={5} />)}
                        </FormItem>
                        <FormItem wrapperCol={{ offset: 6 }}>
                            <Button type="primary" htmlType="submit">修改并保存</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <div className='image-div-topbar'>
                    <Button type='primary' onClick={() => this.setState({visible: true})}>新增图片</Button>
                    <span className='image-div-topbar-span'>格式支持jpg,png,gif等，大小不超过5M</span>
                </div>
                <Row>
                {
                    list.map(image => {
                        return <Col span='8' key={image.id}><ImageCard onClick={() => {
                            this.visibleToggle()
                            this.setState({
                                item: image
                            })
                        }} remove={this._remove} image={image}/></Col>
                    })
                }
                </Row>
                 {
                    total === 0 ? <p style={{marginTop: 20, textAlign: 'center'}}>暂无数据</p> :
                    <div style={{marginTop: 20}}>
                        <Pagination total={total} pageSize={8} showTotal={total => `共${total}条`} onChange={
                            offset => this.props.list({state: 1, limit: 9, offset, category_id: IMAGE})
                                        .then(data => this.setState({list: data.list, loading: false}))
                                        .catch(error => message.error(error))
                        }/>
                    </div>
                }
            </Spin>
        );
    }
}

Image.propTypes = {
    add: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired
};

export default Form.create()(Image)