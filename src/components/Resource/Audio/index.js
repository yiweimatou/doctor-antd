import React, {Component, PropTypes} from 'react';
import {AUDIO, UPLOAD_FILE_API} from '../../../constants/api'
import {Modal, Button, message, Spin, Icon, Form, Row, Col, Pagination, Input, Upload} from 'antd'
import Category from '../../Category'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}

class Audio extends Component {
    state = {
        total: 0,
        list: [],
        visible: false,
        editVisible: false,
        loading: true,
        category: [],
        latLng: {},
        path: '',
        item: {}
    }
    componentWillMount() {
        const {info, list} = this.props
        info({state: 1, category_id: AUDIO})
            .then(data => this.setState({total: data.count}))
            .catch(error => message.error(error))
        list({state: 1, limit: 8, offset: 1, category_id: AUDIO})
            .then(data => this.setState({list: data.list, loading: false}))
            .catch(error => message.error(error))
    }
    _submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const {path} = this.state
            if (!path) {
                return message.error('请上传音频文件!', 5)
            }
            this.setState({loading: true})
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                this.setState({loading: false})
                return message.error('请再选择一级分类')
            }
            const params = {
                category_id: AUDIO,
                state: 1,
                path,
                title: values.title,
                descript: values.descript || ''
            }
            this.props.add(params).then(data => {
                message.success('新建成功')
                this.setState({
                    loading: false, visible: false,
                    list: [{
                        ...params,
                        id: data.identity
                    }].concat(this.state.list),
                    total: this.state.total + 1
                })
                if (category.length > 3) {
                    this.props.grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: AUDIO,
                        foreign_id: data.identity,
                        title: values.title,
                        kind: category[0] === '1' ? category[1] : category[2]
                    })
                }
            }).catch(error => {
                message.error(error)
                this.setState({loading: false})
            })
        })
    }
    submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((erros, values) => {
            if (erros) return
            this._editHandler({
                id: this.state.item.id,
                title: values.title,
                descript: values.descript
            }).catch(err => {
                message.error(err)
            })
        })
    }
    eidtVisibleToggle = ()  => this.setState(prevState => ({
        editVisible: !prevState.editVisible
    }))
    _onCancel = () => this.setState({visible: false})
    _editHandler = audio => {
        this.props.edit(audio).then(() => {
            this.setState(prevState => ({
                list: prevState.list.map(v => {
                    if (v.id === audio.id) {
                        return {
                            ...v,
                            title: audio.title,
                            descript: audio.descript
                        }
                    }
                    return v
                }),
                editVisible: false
            }))
        })
    }
    _removeHandler = id => {
        Modal.confirm({
            onOk: () => {
                this.props.remove({id}).then(() => {
                    this.setState({
                        list: this.state.list.filter(i => i.id !== id),
                        total: this.state.total - 1
                    })    
                }).catch(error => message.error(error))
            },
            title: '确认',
            content: '是否删除？'
        })
    }
    render() {
        const {list, visible, total, loading} = this.state
        const {getFieldDecorator} = this.props.form
        const uploadProps = {
            name: 'upload_file',
            action: UPLOAD_FILE_API,
            accept: 'audio/*',
            beforeUpload: file => {
                const fiveM = 30*1024*1024
                const isToobig = file.size > fiveM
                if (isToobig) {
                    message.error('只允许上传不大于30M的文件!')
                }
                return !isToobig
            },
            onChange: info => {
                if (info.file.status === 'done') {
                    if (info.file.response.code === 200) {
                        this.setState({path: info.file.response.file})
                        message.success(`${info.file.name} 上传成功！`);
                    } else {
                        message.error(`${info.file.name} 上传失败！`)
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败！`);
                }
            },
        }
        return (
            <Spin spinning = {loading}>
                <Modal visible={visible} title="新增音频" footer="" onCancel={this._onCancel} width={720} maskClosable={false}>
                    <Form onSubmit={this._submitHandler}>
                        <FormItem {...formItemLayout} label="音频素材名称" hasFeedback>
                        {getFieldDecorator('title', {rules:[{required: true, whitespace: true, message: '请填写名称'}]})(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="音频" required>
                            <Upload {...uploadProps}>
                                <Button type="ghost">
                                    <Icon type="upload" />上传音频
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem {...formItemLayout} label="分类">
                            <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="说明">
                        {getFieldDecorator('descript')(<Input type='textarea' rows={5} />)}
                        </FormItem>
                         <FormItem wrapperCol={{ offset: 6 }}>
                            <Button type="primary" htmlType="submit">保存至个人素材库</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal visible={this.state.editVisible} title="修改" footer="" onCancel={this.editVisibleToggle} maskClosable={false}>
                    <Form onSubmit={this.submitHandler}>
                        <FormItem {...formItemLayout} label="音频素材名称" hasFeedback>
                            {getFieldDecorator('title', {
                                rules:[{required: true, whitespace: true, message: '请填写名称'}],
                                initialValue: this.state.item.title
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="说明">
                        {getFieldDecorator('descript', {
                            initialValue: this.state.item.descript
                        })(<Input type='textarea' rows={5} />)}
                        </FormItem>
                         <FormItem wrapperCol={{ offset: 6 }}>
                            <Button type="primary" htmlType="submit">保存至个人素材库</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <div className='image-div-topbar'>
                        <Button type='primary' onClick={() => this.setState({visible: true})}>新增音频</Button>
                        <span className='image-div-topbar-span'>格式支持mp3,wma,wav,amr,文件大小不超过30M</span>
                </div>
                <Row>
                {
                    list.map(item => {
                        return (<Col key={item.id} span={6}>
                                    <div style={{width: 302, borderRadius: '4px', border: '1px solid #d9d9d9'}}>
                                        <div style={{ padding: '10px 16px'}}>
                                            <div style={{float:'right'}}>
                                                <a style={{ marginRight: 5 }} onClick={() => {
                                                    this.eidtVisibleToggle()
                                                    this.setState({
                                                        item
                                                    })
                                                }}><Icon type="edit" /> 编辑</a>
                                                <a onClick={() => this._removeHandler(item.id)}>
                                                    <Icon type="close" />删除
                                                </a>
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p style={{color: '#999'}}>{item.descript||'无'}</p>
                                        </div>
                                        <audio controls src={item.path}>请使用现代浏览器</audio>                                        
                                    </div>
                                </Col>) 
                    })
                }
                </Row>
                 {
                    total === 0 ? <p style={{marginTop: 20, textAlign: 'center'}}>暂无数据</p> :
                    <div style={{marginTop: 20}}>
                        <Pagination total={total} pageSize={8} showTotal={total => `共${total}条`} onChange={
                            offset => this.props.list({state: 1, limit: 8, offset, category_id: AUDIO})
                                        .then(data => this.setState({list: data.list, loading: false}))
                                        .catch(error => message.error(error))
                        }/>
                    </div>
                }
            </Spin>
        );
    }
}

Audio.propTypes = {
    add: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
};

export default Form.create()(Audio);