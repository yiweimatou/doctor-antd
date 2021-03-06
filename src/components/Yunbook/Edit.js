import React,{ Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Tabs, Button, Form, Input, Spin, message } from 'antd'
import EditLblView from './EditLblView.js'
import { BOOK } from '../../constants/api'
import Category from '../Category'
import { getYunbook } from '../../services/yunbook'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class Edit extends Component{
    state = {
        lbl:'',
        options:[],
        defaultValue:[],
        loading: false,
        id: 0,
        category: '',
        latLng: {},
        yunbook: {},
    }
    static propTypes = {
        // yunbook: PropTypes.object,
        save: PropTypes.func,
        loading: PropTypes.bool
    }
    
    componentWillMount() {
        const id = this.props.params.id
        if (id) {
            this.setState({ loading: true })
            getYunbook({ id }).then(data => {
                this.setState({ yunbook: data.get, loading:false })
            }).catch(err => {
                message.error(err)
                this.setState({ loading: false })
            })
            const { getGrow, getCategory, init } = this.props
            getGrow({ category_id: BOOK, foreign_id: id }, record => {
                if (record.id > 0){
                    this.setState({ id: record.id })
                    getCategory({ lat: record.lat, lng: record.lng }, list => {
                        const num = list.length
                        let values = []            
                        if (record.kind && record.kind.startsWith(2)) {
                            values = values.concat(record.kind.slice(0,1), record.kind.slice(0,2), record.kind).concat(list.slice(1, num).map(i => i.id))
                        } else if (record.kind && record.kind.startsWith(1)) {
                            values = values.concat(record.kind.slice(0,1), record.kind).concat(list.slice(1, num).map(i => i.id))
                        }
                        if (values.length > 0) {
                            this.setState({
                                defaultValue: values
                            })
                            init(values, opt => this.setState({ options: opt }), error => message.error(error))
                        }
                    }, error => message.error(error))
                }
            }, error => message.error(error))
        }
    }

    changeLbl = lbl => this.setState({ lbl })

    submitHandler=(e)=>{
        e.preventDefault()
        const { grow, save, addGrow } = this.props
        const yunbook = this.state.yunbook
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            const params = {
                lbl: this.state.lbl,
                title: values.title,
                descript: values.descript,
                id: yunbook.id,
                sale_amount: values.money*100
            }
            save(params, () => {
                const category = this.state.category
                if (category.length >= 0 && category.length < 3 ) {
                    return
                }
                if (this.state.id > 0){
                    grow({
                        id: this.state.id,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        kind: category[0] === '1' ? category[1] : category[2]
                    })
                } else {
                    addGrow({
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        kind: category[0] === '1' ? category[1] : category[2],
                        foreign_id: yunbook.id,
                        map_id: 1
                    })
                }
            }, error => message.error(error))
        })
    }
    render(){
        const {
            form
        } = this.props
        const yunbook = this.state.yunbook
        const { getFieldDecorator }=form
        return(
            <div>
                <Spin spinning = { this.state.loading } tip="玩命加载中..." >
                <Tabs defaultActiveKey='2'>
                    <TabPane key='1' tab='基本信息修改'>
                        <Form
                            horizontal
                            onSubmit = { this.submitHandler }
                            style = {{pading:30,margin:'30 0'}}
                        >
                             <FormItem
                                {...formItemLayout}
                                label='云板书标题'
                                hasFeedback
                             >
                            {getFieldDecorator('title',{
                                        rules:[{
                                            required:true,
                                            max:30,
                                            message:'请填写最多30字标题'
                                        }],
                                        initialValue: yunbook.title
                            })(<Input type='text' />)}
                            </FormItem>
                            <FormItem
                                label = '售价'
                                {...formItemLayout}
                            >
                            {getFieldDecorator('money',{
                                        rules:[{validator: (rule, value, callback) => {
                                                if(value) {
                                                    callback()
                                                }else {
                                                    callback('请设置金额')
                                                }
                                            }
                                        }],
                                        initialValue: yunbook.sale_amount/100
                            })(<Input type = 'number' addonAfter = '元' />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='分类'>
                                <Category defaultValue={this.state.defaultValue} options={this.state.options} onChange={(category, latLng) => this.setState({category, latLng})}/>
                            </FormItem>
                            <FormItem
                                label='课程简介'
                                {...formItemLayout}
                            >
                            {getFieldDecorator('descript',{
                                        rules:[{
                                            required:false,
                                            max:300,
                                            message:'最多300字'
                                        }],
                                        initialValue: yunbook.descript
                            })(<Input type='textarea' rows = '5' />)}
                            </FormItem>
                            <button type='submit' id='_submit_'></button>
                        </Form>
                    </TabPane>
                    <TabPane key='2' tab='标注修改'>
                        <EditLblView
                            yunbook={yunbook}
                            changeLbl={this.changeLbl}
                        />
                    </TabPane>
                </Tabs>
                <div style={{top: 0, position: 'absolute', right: 0}}>
                    <Button size='large' type='primary' onClick={this.props.goBack} style={{ marginRight: 5 }}>返回</Button>
                    <Button size='large' type='primary' onClick={()=>{
                            const submit = document.getElementById('_submit_')
                            if(!submit){
                                this.props.save({
                                    lbl: this.state.lbl,
                                    id: this.state.yunbook.id
                                })
                            }else{
                                submit.click()
                            }
                        }
                    }>
                            保存
                    </Button>
                </div>
                </Spin>
            </div>
        )
    }
}

export default connect(null,
    dispatch=>({
        goBack: () => dispatch(goBack()),
        save: (params, resolve, reject)=>{
            dispatch({
                type: 'yunbook/edit',
                payload:params, resolve, reject
            })
        },
        getGrow: (params, resolve, reject) => {
            dispatch({
              type: 'grow/get',
              payload: { params, resolve, reject }
            })
        },
        getCategory: (params, resolve, reject) => {
            dispatch({
                type: 'category/get',
                payload: { params, resolve, reject }
            })
        },
        getList: (params, resolve, reject) => {
            dispatch({
                type: 'category/list',
                payload: {
                    params, resolve, reject
                }
            })
        },
        init: (params, resolve, reject) => {
            dispatch({
                type: 'category/init',
                payload: {
                    params, resolve, reject
                }
            })
        },
        grow: (params, resolve, reject) => {
            dispatch({
                type: 'grow/edit',
                payload: {
                    params, resolve, reject
                }
            })
        },
        addGrow: (params, resolve, reject) => {
            dispatch({
                type: 'grow/add',
                payload: {
                    params, resolve, reject
                }
            })
        }
    })
)(Form.create()(Edit))
