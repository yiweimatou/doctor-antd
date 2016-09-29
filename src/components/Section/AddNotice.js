import React, {Component, PropTypes} from 'react';
import Simditor from '../Simditor'
import { Form, Button, Spin, Input, message } from 'antd'
import { connect } from 'react-redux'
import { NOTICE } from '../../constants/api'
import LessonBar from '../Lesson/LessonBar'
import Paper from '../Paper'
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddNotice extends Component {
    state = {
        section: {}
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { section } = this.state
            const { addSection, editSection, query } = this.props
<<<<<<< Updated upstream
            const content = this.refs.simditor.getValue() 
=======
            const content = this.refs.simditor.getValue()
>>>>>>> Stashed changes
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
                                this.props.redirct(`/lesson/show/${query.lid}`)
                            } else {
                                this.props.redirct(`/organize/show/${query.oid}`)
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
        const { query,fetchSection, getLesson } = this.props
        if (query.id) {
            fetchSection({ id: query.id }, section => {
                this.setState({ section })
            }, error => message.error(error))
        }
<<<<<<< Updated upstream
        getLesson({ id: query.lid })
    }
    render() {
        const { section } = this.state
        const { query, loading, lesson } = this.props
        const { getFieldProps } = this.props.form
=======
    }
    render() {
        const { section } = this.state
        const { query, loading } = this.props
        const { getFieldDecorator } = this.props.form
>>>>>>> Stashed changes
        if ( !query.lid || !query.oid) {
            return (<div>参数错误</div>)
        }
        return (
            <Spin spinning={loading}>
                <Paper>
                    <div style={{margin: '10px 0'}}>
<<<<<<< Updated upstream
                        <LessonBar lesson={ lesson } current='' />
=======
                        <LessonBar lid={ query.lid } current='' />
>>>>>>> Stashed changes
                    </div>
                </Paper>
                <Form>
                    <FormItem {...formItemLayout} hasFeedback label="通知标题">
<<<<<<< Updated upstream
                        <Input {...getFieldProps('title', {
=======
                        <Input {...getFieldDecorator('title', {
>>>>>>> Stashed changes
                            rules: [{
                                required: true,
                                whitespace: false,
                                message: '请填写标题'
                            }],
                            initialValue: section.title
                        })}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知描述">
<<<<<<< Updated upstream
                        <Input type="textarea" rows={5} {...getFieldProps('descript',{ initialValue: section.descript })}/>
=======
                        <Input type="textarea" rows={5} {...getFieldDecorator('descript',{ initialValue: section.descript })}/>
>>>>>>> Stashed changes
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知内容">
                        <Simditor ref='simditor' content={section.content}/>
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }}>
                    { query.edit === '1' ? null:
                        <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到素材</Button>
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
<<<<<<< Updated upstream
    loading: PropTypes.bool.isRequired,
    lesson: PropTypes.object.isRequired
=======
    loading: PropTypes.bool.isRequired
>>>>>>> Stashed changes
};

export default connect(
    state => ({
        query: state.routing.locationBeforeTransitions.query,
<<<<<<< Updated upstream
        loading: state.section.loading,
        lesson: state.lesson.entity
=======
        loading: state.section.loading
>>>>>>> Stashed changes
    }),
    dispatch => ({
        fetchSection: (params, resolve, reject) => {
            dispatch({ type: 'section/get', payload: {
                params, resolve, reject
            }})
        },
<<<<<<< Updated upstream
        getLesson: (params, resolve, reject) => dispatch({
            type: 'lesson/get',
            payload: params, resolve, reject
        }),
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
)(Form.create()(AddNotice));
=======
)(Form.create()(AddNotice));
>>>>>>> Stashed changes
