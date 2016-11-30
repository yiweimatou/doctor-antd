import React, {Component, PropTypes} from 'react';

import { Form, Button, Spin, Input, message } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { NOTICE } from '../../constants/api'
import LessonBar from '../Lesson/LessonBar'
import OrganizeBar from '../Organize/organize_bar'
import Paper from '../Paper'
import ReactQuill from '../ReactQuill'

const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddNotice extends Component {
    state = {
        section: {},
        content: ''
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { section } = this.state
            const { addSection, editSection, query } = this.props
            const content = this.refs.editor.quill.root.innerHTML
            if (content) {
                if (state === 0){
                    if (section.id === undefined){
                        addSection({
                            title: values.title,
                            descript: values.descript || '',
                            organize_id: query.oid,
                            lesson_id: query.lid,
                            category_id: NOTICE,
                            foreign_id: 0,
                            content,
                            state: 2
                        }, id => {
                            this.setState({
                                section: {
                                    id
                                }
                            }),
                            message.success('素材保存成功', 6)
                        }, error => message.error(error, 6))
                    } else {
                        editSection({
                            title: values.title,
                            descript: values.descript || '',
                            content,
                            id: section.id
                        },() => message.success('素材保存成功', 6), error => message.error(error))
                    }
                } else {
                    if (query.edit === '1') {//edit
                        editSection({
                            title: values.title,
                            descript: values.descript || '',
                            content,
                            id: section.id
                        },() => message.success('编辑成功', 6), error => message.error(error))
                    }else {//add
                        addSection({
                            title: values.title,
                            descript: values.descript || '',
                            organize_id: query.oid,
                            lesson_id: query.lid,
                            category_id: NOTICE,
                            foreign_id: 0,
                            content,
                            state: 1
                        },() => {
                            if (query.lid>0) {
                                this.props.redirct(`/lesson/section?lid=${query.lid}&oid=0`)
                            } else {
                                this.props.redirct(`/organize/section?oid=${query.oid}&lid=0`)
                            }
                            message.success('发布成功', 6)
                        }, error => message.error(error))
                    }
                }
            } else {
                return message.error('请填写内容!', 6)
            }
        })
    }
    componentWillMount() {
        const { query,fetchSection } = this.props
        if (query.id) {
            fetchSection({ id: query.id }, section => {
                this.setState({ section, content: section.content })
            }, error => message.error(error))
        }
    }
    render() {
        const { section, content } = this.state
        const { query, loading } = this.props
        const { getFieldDecorator } = this.props.form
        if ( !query.lid || !query.oid) {
            return (<div>参数错误</div>)
        }
        return (
            <Spin spinning={loading}>
                <Paper>
                    <div style={{margin: '10px 0'}}>
                        { query.oid > 0 ?
                            <OrganizeBar organize={this.props.organize} /> :
                            <LessonBar lid={ query.lid } current='' />
                        }
                    </div>
                </Paper>
                <Form>
                    <FormItem {...formItemLayout} hasFeedback label="通知标题">
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                whitespace: false,
                                message: '请填写标题'
                            }],
                            initialValue: section.title
                        })(<Input  />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知描述">
                        {getFieldDecorator('descript',{ initialValue: section.descript })(<Input type="textarea" rows={5}  />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知内容">
                        <ReactQuill content={content} ref="editor" />
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }}>
                    { query.edit === '1' ? null:
                        <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到课程资源库</Button>
                    }
                        <Button type='primary' onClick={() => this.submitHandler(1)}>保存并发布</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}

AddNotice.propTypes = {
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default connect(
    state => ({
        query: state.routing.locationBeforeTransitions.query,
        loading: state.section.loading,
        organize: state.organize.entity
    }),
    dispatch => ({
        fetchSection: (params, resolve, reject) => {
            dispatch({ type: 'section/get', payload: {
                params, resolve, reject
            }})
        },
        redirct: path => dispatch(push(path)),
        addSection: (params, resolve, reject) => {
            dispatch({ type: 'section/add', payload: {
                params, resolve, reject
            }})
        },
        editSection: (params, resolve, reject) => {
            dispatch({ type: 'section/edit', payload: {
                params, resolve, reject
            }})
        },
    })
)(Form.create()(AddNotice));
