import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { 
    Form,
    Button,
    Input,
    Steps,
    Tabs,
    Pagination,
    Row,
    Col,
    message,
    Cascader,
    Modal
} from 'antd'
import SelectYunbook from '../Yunbook/SelectYunbook'
import {getArea,getAreaList} from '../../services/area.js'
import {
    getLesson
} from '../../services/lesson'
import { push } from 'react-router-redux'

const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class New extends Component {
    static propTypes ={
        form:PropTypes.object,
        handleNew:PropTypes.func.isRequired,
        changeHandler:PropTypes.func.isRequired,
        list:PropTypes.object,
        mylist:PropTypes.object,
        uid:PropTypes.number,
        lid:PropTypes.string,
        push: PropTypes.func.isRequired
    }
    state = {
        currentStep:1,
        initialOptions:[],
        yunbook:null,
        show: false,
        category_id: null
    }
    handleCancel = () => this.setState({
        show: false
    })
    handleOk = () => {
        this.setState({
            currentStep:2,
            show: false
        })
        message.success(`引用了:${this.state.yunbook.title}`)
        this.props.form.setFieldsValue({
            'sname':this.state.yunbook.title
        })
    }
    handlePick=(yunbook)=>{
        this.setState({
            yunbook,
            show: true
        })
        
    }
    handleNext = (step)=>{
        this.setState({
            currentStep:step
        })
    } 
    submitHandler=e=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            this.props.handleNew({
                book_id:this.state.yunbook.id,
                lbl:this.state.yunbook.lbl,
                title:values.sname,
                area_id:values.area_ids[0],
                lesson_id:this.props.lid,
                descript:values.descript || '',
                category_id: this.state.category_id
            }, () => this.props.push(`/lesson/show/${this.props.lid}`))
        })
    }
    onClick=()=>{
        document.getElementById('_submit').click()
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = 5 ===targetOption.zoom
        targetOption.loading=true
        getAreaList({
            limit:100,
            pid:targetOption.value
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.id,
                        zoom:item.zoom,
                        isLeaf
                    }
                })
            }else{
                targetOption.children = []
            }
            this.setState({
                options:[...this.state.initialOptions]
            })
        }).catch(error=>{
            message.error(error)
        })   
    }
    componentWillMount(){
        let a3 = []
        getLesson({
            id:this.props.lid
        }).then(data=>{
            this.setState({ category_id: data.get.category_id })
            return data.get
        }).then(lesson=>{
            return getArea({
                id:lesson.area_id
            }).then(data=>data.get)
        }).then(area => {
            return getAreaList({pid : area.id, limit: 100})
        }).then((areas)=>{
            a3 = areas.list.map(item => ({
                    value: item.id,
                    label: item.title,
                    zoom: item.zoom,
                    isLeaf: false
                }))
            this.setState({
                initialOptions: a3
            })
        }).catch(error=>{
            message.error(error)
        })
    }
    render(){
        const cs = this.state.currentStep
        const {
            list,mylist,changeHandler,uid,form
        } = this.props
        const {
            getFieldProps
        } = form
        return(
            <div>
                <Modal title="购买云板书" visible={this.state.show}
                    onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <p>云板书名称：{this.state.yunbook&&this.state.yunbook.title}</p>
                    <p>云板书价格：<em style={{color:'orange',fontSize:'200%'}}>{this.state.yunbook&&this.state.yunbook.money}</em>元</p>
                </Modal>
                <Steps current={cs}>
                    <Step title='选择云板书' />
                    <Step title='文章基本信息' />
                </Steps>
                {
                        cs === 1 ?
                        <Tabs>
                            <TabPane tab='全部云板书' key='1'>
                                <Row>
                                {
                                    list.data.map(yunbook=>{
                                        return (<Col key={yunbook.id} span={8}>
                                                    <SelectYunbook 
                                                        yunbook={yunbook}
                                                        handlePick = {this.handlePick}
                                                    />
                                                </Col>
                                            )
                                    })
                                }
                                </Row>
                                <div className='pagination'>
                                    <Pagination 
                                        total={list.total}
                                        showTotal={total => `共 ${total} 条`}
                                        pageSize = {6}
                                        onChange = {(page)=>changeHandler(page,list.limit,0)}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='我的云板书' key='2'>
                                <Row gutter={8}>
                                {
                                    mylist.data.map(yunbook=>{
                                        return (
                                            <Col key={yunbook.id} span={8}>
                                                <SelectYunbook 
                                                    yunbook={yunbook}
                                                    handlePick = {this.handlePick}
                                                />
                                            </Col>
                                        )
                                    })
                                }
                                </Row>
                                <div className='pagination'>
                                    <Pagination 
                                        total={mylist.total}
                                        showTotal={total => `共 ${total} 条`}
                                        pageSize = {mylist.limit}
                                        onChange = {(page)=>changeHandler(page,list.limit,uid)}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
                        :
                        <Form
                            horizontal 
                            className = 'form'
                            onSubmit = { this.submitHandler }
                        >
                            <FormItem
                                label='文章名称'
                                hasFeedback
                                {...formItemLayout}
                            >
                                <Input 
                                    type='text'
                                    {...getFieldProps('sname',{
                                        rules:[{
                                            required:true,
                                            max:30,
                                            message:'请输入少于30字的名称'
                                        }]
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='文章简介'
                                {...formItemLayout}
                            >
                                <Input
                                    type='textarea'
                                    rows = '3'
                                    {...getFieldProps('descript',{
                                        rules:[{
                                            required:false,
                                            max:200,
                                            message:'请输入少于200字的简介'
                                        }]
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='分类'
                                {...formItemLayout}
                            >
                                 <Cascader
                                    changeOnSelect = { true }
                                    loadData = { this.loadData }
                                    placeholder = '请选择分类'
                                    {...getFieldProps('area_ids',{
                                        rules:[{
                                            required:true,
                                            type:'array',
                                            message:'请选择分类'
                                        }]
                                    })}
                                    options = {
                                        this.state.initialOptions
                                    }                 
                                />
                            </FormItem>
                            <button type='submit' id='_submit'></button>
                        </Form>
                    }
                <div style={{ marginTop: 24 }}>
                    {
                        cs === 1?
                        <Button 
                            disabled = {this.state.bid===0} 
                            onClick={()=>this.handleNext(2)}
                        >
                            下一步
                        </Button>
                        :
                        <div>
                            <Button 
                                disabled = {this.state.bid===0} 
                                onClick={()=>this.handleNext(1)}
                                style ={{marginRight:10}}
                            >
                                上一步
                            </Button>
                            <Button type='primary' onClick={this.onClick}>   
                                发布
                            </Button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}


export default connect(
    state=>({
        list:state.yunbook.list,
        mylist:state.yunbook.mylist,
        uid:state.auth.key,
        lid:state.routing.locationBeforeTransitions.pathname.split('/')[3]
    }),
    dispatch=>({
        changeHandler:(offset,limit,uid)=>{
            if( uid === 0){
                dispatch({
                    type:'yunbook/list',
                    payload:{
                        limit,
                        offset
                    }
                })
            }else{
                dispatch({
                    type:'yunbook/mylist',
                    payload:{
                        offset,limit,uid
                    }
                })
            }
        },
        handleNew:(section, resolve)=>{
            dispatch({
                type:'section/new',
                payload:{
                    ...section
                },
                meta: {
                    resolve
                }
            })
        },
        push: path => dispatch(push(path))
    })
)(Form.create()(New))