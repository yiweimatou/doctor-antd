import React, { Component, PropTypes } from 'react';
import Simditor from '../Simditor'
import { Form, Button, Spin, Input, message } from 'antd'
import { connect } from 'react-redux'
import { HTML } from '../../constants/api'
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddHtml extends Component {
    state = {
        section: {},
        initialContent: ''
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const content = this.refs.simditor.getValue() 
            if (content) {
                if (state === 0){
                    if (this.state.section.id === undefined){
                        this.props.addSection({
                            title: values.title,
                            descript: values.descript || '',
                            organize_id: this.props.query.oid,
                            lesson_id: this.props.query.lid,
                            category_id: HTML,
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
                        this.props.editSection({
                            title: values.title,
                            descript: values.descript || '',
                            content,
                            id: this.state.section.id
                        },() => message.success('素材保存成功', 6), error => message.error(error))
                    }
                } else {
                    if (this.props.query.edit === '1') {//edit
                        this.props.editSection({
                            title: values.title,
                            descript: values.descript || '',
                            content,
                            id: this.state.section.id
                        },() => message.success('编辑成功', 6), error => message.error(error))
                    }else {//add
                        this.props.addSection({
                            title: values.title,
                            descript: values.descript || '',
                            organize_id: this.props.query.oid,
                            lesson_id: this.props.query.lid,
                            category_id: HTML,
                            foreign_id: 0,
                            content,
                            state: 1
                        },() => message.success('发布成功', 6), error => message.error(error))
                    }
                }
            } else {
                return message.error('请填写内容!', 6)
            }
        })
        
    }
    componentWillMount() {
        const { query, fetchSection } = this.props
        if (query.id) {
            fetchSection({ id: query.id }, section => {
                this.setState({ section, initialContent: section.content })
            }, error => message.error(error))
        }
    }
    render() {
        const { query, loading } = this.props
        const { initialContent, section } = this.state
        const { getFieldProps } = this.props.form
        if (!query.oid || !query.lid) {
            return (<div>参数错误</div>)
        }
        return (
            <div>
                <Spin spinning={loading}>
                    <Form>
                        <FormItem {...formItemLayout} hasFeedback label="文章标题">
                            <Input {...getFieldProps('title', {
                                rules: [{
                                    required: true,
                                    whitespace: false,
                                    message: '请填写标题'
                                }], 
                                initialValue: section.title
                            })}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label="文章描述">
                            <Input type="textarea" rows={5} {...getFieldProps('descript', {
                                initialValue: section.descript
                            })}/>
                        </FormItem>
                        <FormItem label="图文内容" {...formItemLayout}>
                            <Simditor ref='simditor' content={ initialContent } />                                                  
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

AddHtml.propTypes = {
    userId: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    addSection: PropTypes.func.isRequired,
    editSection: PropTypes.func.isRequired,
    fetchSection: PropTypes.func.isRequired,
}

export default connect(
    state => ({
        userId: state.auth.key,
        query: state.routing.locationBeforeTransitions.query,
        loading: state.section.loading,
    }),
    dispatch => ({
        fetchSection: (params, resolve, reject) => {
            dispatch({ type: 'section/get', payload: {
                params, resolve, reject
            }})
        },
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
)(Form.create()(AddHtml));