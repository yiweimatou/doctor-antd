import React, { Component, PropTypes } from 'react';
import { Form, Button, Spin, Input, message, Upload, Icon } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { HTML, UPLOAD_COVER_API } from '../../constants/api'
import LessonBar from '../Lesson/LessonBar'
import Paper from '../Paper'
import RichTextEditor, {createValueFromString, createEmptyValue} from '../RichTextEditor'
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}

class AddHtml extends Component {
    state = {
        section: {},
        initialContent: createEmptyValue(),
        fileList: []
    }
    submitHandler = state => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const content = this.state.initialContent.toString('html')
            let cover = ''
            if (this.state.fileList.length > 0) {
                cover = this.state.fileList[0].url
            }
            const {
                query, addSection, editSection
            } = this.props
            const params = {
                title: values.title,
                descript: values.descript || '',
                organize_id: query.oid,
                lesson_id: query.lid,
                category_id: HTML,
                foreign_id: 0,
                cover,
                content,
            }
            if (content) {
                if (state === 0){
                    if (this.state.section.id === undefined){
                        addSection({
                            ...params,
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
                            cover,
                            id: this.state.section.id
                        },() => message.success('素材保存成功', 6), error => message.error(error))
                    }
                } else {
                    if (query.edit === '1') {//edit
                        editSection({
                            title: values.title,
                            descript: values.descript || '',
                            content,
                            cover,
                            id: this.state.section.id
                        },() => message.success('编辑成功', 6), error => message.error(error))
                    }else {//add
                        addSection({
                            ...params,
                            state: 1
                        },() => {
                            if (query.lid > 0) {
                                this.props.redirct(`/lesson/section?id=${query.lid}`)
                            } else {
                                this.props.redirct(`/organize/section?id=${query.oid}`)
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
        const { query, fetchSection } = this.props
        if (query.id) {
            fetchSection({ id: query.id }, section => {
                this.setState({ section, initialContent: createValueFromString(section.content,'html'),
                    fileList: section.cover? [{
                        uid: -1, name: '封面.png', status: 'done', url: section.cover
                    }]:[] })
            }, error => message.error(error))
        }
    }
    handleChange = info => {
        let fileList = info.fileList
        fileList = fileList.slice(-1)
        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.cover
            }
            return file
        })
        fileList = fileList.filter(file => {
            if (file.response) {
                return file.response.code === 200
            }
            return true
        })
        this.setState({ fileList })
    }
    _onChange = value => {
        this.setState({initialContent: value})
    }
    render() {
        const { query, loading } = this.props
        const { initialContent, section } = this.state
        const { getFieldDecorator } = this.props.form
        if (!query.oid || !query.lid) {
            return (<div>参数错误</div>)
        }
        return (
            <div>
                <Paper>
                    <div style={{margin: '10px 0'}}>
                        <LessonBar lid={ query.lid } current='' />
                    </div>
                </Paper>
                <Spin spinning={loading}>
                    <Form>
                        <FormItem {...formItemLayout} hasFeedback label="文章标题">
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    whitespace: false,
                                    message: '请填写标题'
                                }],
                                initialValue: section.title
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="文章描述">
                            {getFieldDecorator('descript', {
                                initialValue: section.descript
                            })(<Input type="textarea" rows={5}  />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="文章封面">
                            <Upload
                                accept='image/jpg,image/jpeg,image/png'
                                name='upload_file'
                                action={UPLOAD_COVER_API}
                                listType="picture"
                                fileList={this.state.fileList}
                                onChange = {this.handleChange}
                            >
                                <Button type="ghost">
                                    <Icon type="upload" /> 点击上传
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem label="图文内容" {...formItemLayout}>
                            <RichTextEditor value={initialContent}
                                onChange={this._onChange}
                                placeholder="请填写内容"
                                readOnly={false}
                            />
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

AddHtml.propTypes = {
    query: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    addSection: PropTypes.func.isRequired,
    editSection: PropTypes.func.isRequired,
    fetchSection: PropTypes.func.isRequired,
    redirct: PropTypes.func.isRequired
}

export default connect(
    state => ({
        query: state.routing.locationBeforeTransitions.query,
        loading: state.section.loading
    }),
    dispatch => ({
        redirct: path => dispatch(push(path)),
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
