/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react';
import { Form, Spin, Button, Input, InputNumber, DatePicker, message } from 'antd'
import { connect } from 'react-redux'
import { ACTIVE } from '../../constants/api'
import Simditor from '../Simditor'
import Map from '../Map'
const RangePicker = DatePicker.RangePicker
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddActive extends Component {
    state = {
        section: {},
        initialContent: '',
        latLng: { lat: 0, lng: 0 }
    }
    componentWillMount() {
        const { query, fetchSection } = this.props
        if (query.id) {
            fetchSection({
                id: query.id
            }, section => this.setState({ section, initialContent: section.conent, latLng: {
                lat: section.lat, lng: section.lng
            } }), error => message.error(error))
        }
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { section, latLng } = this.state
            const { addSection, editSection, query } = this.props
            const content = this.refs.simditor.getValue()
            const params = {
                title: values.title,
                descript: values.descript || '',
                category_id: ACTIVE,
                address: values.address || '',
                start_ms: (new Date(values.time[0])).getTime(),
                expires_ms: (new Date(values.time[1])).getTime(),
                active_max_num: values.active_max_num,
                organize_id: query.oid,
                lesson_id: query.lid,
                lat: latLng.lat,
                lng: latLng.lng,
                foreign_id: 0,
                content
            }
            if (state === 0) {
                // 保存到素材
                if (section.id === undefined) {
                    addSection({
                        ...params,
                        state: 2
                    }, id => {
                        message.success('保存到素材库')
                        this.setState({ section: { id } })
                    }, error=> message.error(error, 5))
                } else {
                    editSection({
                        title: values.title,
                        descript: values.descript || '',
                        address: values.address || '',
                        start_ms: (new Date(values.time[0])).getTime(),
                        expires_ms: (new Date(values.time[1])).getTime(),
                        active_max_num: values.active_max_num,
                        lat: latLng.lat,
                        lng: latLng.lng,
                        content,
                        id: section.id
                    }, () => message.success('素材保存成功'), error => message.error(error))
                }
            } else {
                if (query.edit === '1') {
                    if (section.id === undefined) return message.error('url参数错误', 5)
                    editSection({
                        title: values.title,
                        descript: values.descript || '',
                        address: values.address || '',
                        start_ms: (new Date(values.time[0])).getTime(),
                        expires_ms: (new Date(values.time[1])).getTime(),
                        active_max_num: values.active_max_num,
                        content,
                        lat: latLng.lat,
                        lng: latLng.lng,
                        id: section.id
                    }, () => message.success('活动编辑成功'), error => message.error(error))
                } else {
                    addSection({ ...params, state: 1 }, () => {
                        message.success('发布成功', 5)
                        if (query.lid>0) {
                            this.props.redirct(`/lesson/show/${query.lid}`)
                        } else {
                            this.props.redirct(`/organize/show/${query.oid}`)
                        }
                    }, error => message.error(error))
                }
            }
        })
    }
    render() {
        const { loading, query } = this.props
        const { getFieldProps } = this.props.form
        const { section, initialContent, latLng } = this.state
         if (!query.oid || !query.lid) {
            return (<div>参数错误</div>)
        }
        return (
            <div>
                <Spin spinning={loading}>
                    <Form>
                        <FormItem {...formItemLayout} hasFeedback label="活动标题">
                            <Input {...getFieldProps('title', {
                                rules: [{
                                    required: true,
                                    whitespace: false,
                                    message: '请填写活动标题'
                                }], 
                                initialValue: section.title
                            })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动定位">
                            <Map latLng={ latLng } setLatlng = { latLng => this.setState({ latLng }) }/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动地址">
                            <Input {...getFieldProps('address', {
                                initialValue: section.address
                            })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label='活动人数上限'>
                            <InputNumber min={1} {...getFieldProps('active_max_num',{
                                rules: [{
                                    required: true,
                                    type: 'number',
                                    message: '请填写活动人数上限'
                                }], 
                                initialValue: section.active_max_num || 1
                            })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择活动时间">
                            <RangePicker showTime format="yyyy/MM/dd HH:mm:ss" {...getFieldProps('time', {
                                rules: [{
                                    required: true,
                                    type: 'array',
                                    message: '请选择活动时间'
                                }], 
                                initialValue: section.start_ms && section.expires_ms && [new Date(section.start_ms*1000), new Date(section.expires_ms*1000)]
                            })} />
                        </FormItem>
                        <FormItem label="图文内容" {...formItemLayout}>
                            <Simditor ref='simditor' content={ initialContent } />                                                  
                        </FormItem>
                        <FormItem {...formItemLayout} label="活动描述">
                            <Input type="textarea" rows={5} {...getFieldProps('descript', {
                                initialValue: section.descript
                            })}/>
                        </FormItem>
                        <FormItem wrapperCol={{ offset: 6 }}>
                            {   query.id && query.edit ? null :
                                <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到素材</Button>
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
    }),
    dispatch => ({
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
