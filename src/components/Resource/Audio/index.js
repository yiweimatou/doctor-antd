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
    state: {
        total: 0,
        list: [],
        visible: false,
        category: [],
        latLng: {}
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
    }
    _onCancel = () => this.setState({visible: false})
    render() {
        const {list, visible, total} = this.state
        const {getFieldDecorator} = this.props.form
        const uploadProps = {
            name: 'upload_file',
            action: UPLOAD_FILE_API,
            beforeUpload: file => {
                const fiveM = 30*1024*1024
                const isToobig = file.size > fiveM
                if (isToobig) {
                    message.error('只允许上传不大于5M的图片!')
                }
                return !isToobig
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        }
        return (
            <Spin>
                <Modal visible={visible} title="上传音频" footer="" onCancel={this._onCancel}>
                    <Form onSubmit={this._submitHandler}>
                        <FormItem {...formItemLayout} label="音频素材名称" hasFeedback>
                        {getFieldDecorator('title', {rules:[{required: true, whitespace: true, message: '请填写名称'}]})(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="音频">
                            <Button type="ghost">
                                <Upload {...uploadProps}>
                                    <Icon type="upload" />上传音频
                                </Upload>
                            </Button>
                        </FormItem>
                        <FormItem {...formItemLayout} label="分类">
                            <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="说明">
                        {getFieldDecorator('descript')(<Input type='textarea' rows={5} />)}
                        </FormItem>
                         <FormItem wrapperCol={{ offset: 6 }}>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <div className='image-div-topbar'>
                        <Button type='primary' onClick={() => this.setState({visible: true})}>上传音频</Button>
                        <span className='image-div-topbar-span'>格式支持mp3,wma,wav,amr,文件大小不超过30M</span>
                </div>
                <Row>
                {
                    list.map(item => {
                        <Col key={item.id} span={6}>
                            <audio contol src={item.path}>请使用现代浏览器</audio>
                            {item.title}
                        </Col>
                    })
                }
                </Row>
                 {
                    total === 0 ? <p style={{marginTop: 20, textAlign: 'center'}}>暂无数据</p> :
                    <div style={{marginTop: 20}}>
                        <Pagination total={total} showTotal={total => `共${total}条`}/>
                    </div>
                }
            </Spin>
        );
    }
}

Audio.propTypes = {
    add: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired
};

export default Audio;