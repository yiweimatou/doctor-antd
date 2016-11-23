/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react';
import { Form, Spin, Button, Input, InputNumber, DatePicker, message } from 'antd'
import ImgUploader from '../ImgUploader'
import { connect } from 'react-redux'
import { ACTIVE } from '../../constants/api'
import Map from '../Map'
import moment from 'moment'
import LessonBar from '../Lesson/LessonBar'
import { push } from 'react-router-redux'
import DraftEditor, { toHTML, fromHTML, create } from '../DraftEditor'
import OrganizeBar from '../Organize/organize_bar'
const RangePicker = DatePicker.RangePicker
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddActive extends Component {
    state = {
        section: {},
        latLng: { lat: 0, lng: 0 },
        address: '',
        content: create(fromHTML('<div></div>')),
        fileList: [],
        initialFileList: []
    }
    componentWillMount() {
        const { query, fetchSection } = this.props
        if (query.id) {
            fetchSection({
                id: query.id
            }, section => this.setState({
                section, address: section.address, latLng: {lat: section.lat, lng: section.lng},
                content: create(fromHTML(section.content)),
                fileList: section.cover? [{
                        uid: -1, name: '封面.png', status: 'done', url: section.cover
                    }]:[],
                initialFileList:  section.cover? [{
                        uid: -1, name: '封面.png', status: 'done', url: section.cover
                    }]:[]
            }),
            error => message.error(error))
        }
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { section, latLng } = this.state
            const { addSection, editSection, query } = this.props
            const content = toHTML(this.state.content.getCurrentContent())
            let cover = ''
            const files = this.state.fileList
            if (files && files[0]) {
                cover = files[0].url
            }
            const params = {
                title: values.title,
                descript: values.descript || '',
                category_id: ACTIVE,
                address: this.state.address || '',
                start_ms: (new Date(values.time[0])).getTime(),
                expires_ms: (new Date(values.time[1])).getTime(),
                active_max_num: values.active_max_num,
                organize_id: query.oid,
                lesson_id: query.lid,
                lat: latLng.lat,
                lng: latLng.lng,
                foreign_id: 0,
                content,
                cover
            }
            if (state === 0) {
                // 保存到课程资源库
                if (section.id === undefined) {
                    addSection({
                        ...params,
                        state: 2
                    }, id => {
                        message.success('保存到课程资源库库')
                        this.setState({ section: { id } })
                    }, error=> message.error(error, 5))
                } else {
                    editSection({
                        title: values.title,
                        descript: values.descript || '',
                        address: this.state.address,
                        start_ms: (new Date(values.time[0])).getTime(),
                        expires_ms: (new Date(values.time[1])).getTime(),
                        active_max_num: values.active_max_num,
                        lat: latLng.lat,
                        lng: latLng.lng,
                        content,
                        cover,
                        id: section.id
                    }, () => message.success('素材保存成功'), error => message.error(error))
                }
            } else {
                if (query.edit === '1') {
                    if (section.id === undefined) return message.error('url参数错误', 5)
                    editSection({
                        title: values.title,
                        descript: values.descript || '',
                        address: this.state.address,
                        start_ms: values.time[0].unix(),
                        expires_ms: values.time[1].unix(),
                        active_max_num: values.active_max_num,
                        content,
                        cover,
                        lat: latLng.lat,
                        lng: latLng.lng,
                        id: section.id
                    }, () => {
                        message.success('活动编辑成功')
                        if (query.lid>0) {
                            this.props.redirct(`/lesson/section?lid=${query.lid}&oid=0`)
                        } else {
                            this.props.redirct(`/organize/section?oid=${query.oid}&lid=0`)
                        }
                    }, error => message.error(error))
                } else {
                    addSection({ ...params, state: 1 }, () => {
                        message.success('发布成功', 5)
                        if (query.lid>0) {
                            this.props.redirct(`/lesson/section?lid=${query.lid}&oid=0`)
                        } else {
                            this.props.redirct(`/organize/section?oid=${query.oid}&lid=0`)
                        }
                    }, error => message.error(error))
                }
            }
        })

    }
    render() {
        const { loading, query } = this.props
        const { getFieldDecorator } = this.props.form
        const { section, latLng, address, content } = this.state
         if (!query.oid || !query.lid) {
            return (<div>参数错误</div>)
        }
        return (
            <div>
                <Spin spinning={loading}>
                    {
                        query.oid > 0 ? 
                        <OrganizeBar organize={this.props.organize} /> : <LessonBar lid={query.lid} current=""/>
                    }
                    <Form>
                        <FormItem {...formItemLayout} hasFeedback label="活动标题">
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    whitespace: false,
                                    message: '请填写活动标题'
                                }],
                                initialValue: section && section.title
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动定位">
                            <Map latLng={ latLng } setAddress={(address, latLng) => this.setState({ address, latLng })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动地址">
                            <Input value={address} onChange={e => this.setState({ address: e.target.value })} />
                        </FormItem>
                        <FormItem {...formItemLayout} label='活动人数上限'>
                            {getFieldDecorator('active_max_num',{
                                rules: [{
                                    required: true,
                                    type: 'number',
                                    message: '请填写活动人数上限'
                                }],
                                initialValue: section && section.active_max_num || 1
                            })(<InputNumber min={1} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="文章封面">
                            <ImgUploader fileList={this.state.fileList} onChange={fileList => this.setState({fileList})}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择活动时间">
                            {getFieldDecorator('time', {
                                rules: [{
                                    required: true,
                                    type: 'array',
                                    message: '请选择活动时间'
                                }],
                              initialValue:
                                section && section.start_ms && section.expires_ms
                                && [
                                    moment.unix(section.start_ms),
                                    moment.unix(section.expires_ms)
                                ]
                            })(<RangePicker showTime format="YYYY/MM/DD hh:mm"  />)}
                        </FormItem>
                        <FormItem label="图文内容" {...formItemLayout}>
                            <DraftEditor editorState={content} placeholder="请填写内容" onChange={content => this.setState({content})} />
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动描述">
                            {getFieldDecorator('descript', {
                                initialValue: section && section.descript
                            })(<Input type="textarea" rows={5} />)}
                        </FormItem>
                        <FormItem wrapperCol={{ offset: 6 }}>
                            {   query.id && query.edit ? null :
                                <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到课程资源库</Button>
                            }
                            <Button type='primary' onClick={() => this.submitHandler(1)}>保存并发布</Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        );
    }
}

AddActive.propTypes = {
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    addSection: PropTypes.func.isRequired,
    editSection: PropTypes.func.isRequired,
    fetchSection: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        loading: state.section.loading,
        query: state.routing.locationBeforeTransitions.query,
        organize: state.organize.entity
    }),
    dispatch => ({
        redirct: path => dispatch(push(path)),
        fetchSection: (params, resolve, reject) => dispatch({ type: 'section/get', payload: {
            params, resolve, reject
        }}),
        addSection: (params, resolve, reject) => dispatch({ type: 'section/add', payload: {
            params, resolve, reject
        }}),
        editSection: (params, resolve, reject) => dispatch({ type: 'section/edit', payload: {
            params, resolve, reject
        }})
    })
)(Form.create()(AddActive));
