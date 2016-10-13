import React,{ Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs, Button, Form, Input, Spin, message } from 'antd'
import EditLblView from './EditLblView.js'
import { BOOK } from '../../constants/api'
import Category from '../Category'

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
        id: 0
    }
    static propTypes = {
        yunbook: PropTypes.object,
        save: PropTypes.func,
        loading: PropTypes.bool
    }
    componentWillReceiveProps(nextProps){
        const { yunbook, getGrow, getCategory, init } = this.props
        if(nextProps.yunbook && !yunbook){
            this.setState({
                lbl:nextProps.yunbook.lbl
            })
            getGrow({ category_id: BOOK, foreign_id: nextProps.yunbook.id }, record => {
                if (record.id > 0){
                    this.setState({ id: record.id })
                    getCategory({ lat: record.lat, lng: record.lng }, list => {
                        const num = list.length
                        let values = []                   
                        if (record.kind && record.kind.startsWith(2)) {
                            values = values.concat(record.kind.slice(0,1), record.kind.slice(0,2), record.kind).concat(list.slice(1, num).map(i => i.id))
                        } else if (record.kind) {
                            values = values.concat(record.kind.slice(0,1), record.kind).concat(list.slice(1, num).map(i => i.id))
                        }
                        this.setState({
                            defaultValue: values
                        })
                        init(values, opt => this.setState({ options: opt }), error => message.error(error))
                    }, error => message.error(error))
                }
            }, error => message.error(error))
        }
    }
    changeLbl = lbl => this.setState({ lbl })

    submitHandler=(e)=>{
        e.preventDefault()
        const { grow, save, yunbook } = this.props
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
                const category = this.refs.select.refs.category.state.value
                if (category.length >= 0 && category.length < 3 ) {
                    return
                }
                if (this.state.id > 0){
                    grow({
                        id: this.state.id,
                        lat: this.refs.select.getLatLng().lat,
                        lng: this.refs.select.getLatLng().lng,
                        foreign_id: yunbook.id,
                        map_id: 1,
                        kind: category[0].id === '1' ? category[1] : category[2]
                    })
                }
            }, error => message.error(error))
        })
    }
    render(){
        const {
            form, yunbook, getList
        } = this.props
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
                                        initialValue:yunbook&&yunbook.title
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
                                        initialValue:yunbook&&yunbook.sale_amount/100
                            })(<Input type = 'number' addonAfter = '元' />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label='分类'>
                                <Category ref='select' defaultValue={this.state.defaultValue} getList={getList} options={this.state.options}/>
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
                                        initialValue:yunbook&&yunbook.descript
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
                <Button style={{top:0,padding: '4px 20px 5px 20px',position:'absolute',right:23}} size='large' type='primary' onClick={()=>{
                        const submit = document.getElementById('_submit_')
                        if(!submit){
                            this.props.save({
                                lbl: this.state.lbl,
                                id: this.props.yunbook.id
                            })
                        }else{
                            submit.click()
                        }
                    }
                }>
                        保存
                </Button>
                </Spin>
            </div>
        )
    }
}

export default connect(
    state => ({
        yunbook: state.yunbook.entity
    }),
    dispatch=>({
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
        }
    })
)(Form.create()(Edit))
