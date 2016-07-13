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
    message 
} from 'antd'
import AreaCascader from '../AreaCascader'
import SelectYunbook from '../Yunbook/SelectYunbook'
import {getArea} from '../../services/area.js'
import {
    getLesson
} from '../../services/lesson'

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
        lid:PropTypes.string
    }
    state = {
        currentStep:1,
        bid:0,
        lbl:'',
        initialOptions:[]
    }
    handlePick=(yunbook)=>{
        this.setState({
            bid:yunbook.bid,
            lbl:yunbook.lbl,
            currentStep:2
        })
        message.success(`引用了:${yunbook.title}`)
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
                bid:this.state.bid,
                lbl:this.state.lbl,
                sname:values.sname,
                aid:values.aid[3],
                lid:this.props.lid,
                descript:values.descript
            })
        })
    }
    onClick=()=>{
        document.getElementById('_submit').click()
    }
    componentWillMount(){
        let a1=[],a2=[],a3=[]
        getLesson({
            lid:this.props.lid
        }).then(data=>{
            return data.get
        }).then(lesson=>{
            return getArea({
                aid:lesson.aid
            }).then(data=>data.get)
        }).then(area=>{
            a3.push({
                value:area.aid,
                label:area.title,
                zoom:area.zoom,
                isLeaf:false
            })
            return getArea({
                aid:area.pid,
                zoom:area.zoom-1
            }).then(data=>data.get)
        }).then(area=>{
            a2.push({
                value:area.aid,
                label:area.title,
                zoom:area.zoom,
                children:a3
            })
            return getArea({
                aid:area.pid,
                zoom:area.zoom-1
            }).then(data=>data.get)
        }).then(area=>{
            a1.push({
                value:area.aid,
                label:area.title,
                zoom:area.zoom,
                children:a2
            })
            this.setState({
                initialOptions:a1
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
                                        return (<Col key={yunbook.bid} span={8}>
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
                                        defaultPageSize = {list.limit}
                                        onChange = {(page)=>changeHandler(page,list.limit,0)}
                                    />
                                </div>
                            </TabPane>
                            <TabPane tab='我的云板书' key='2'>
                                <Row gutter={8}>
                                {
                                    mylist.data.map(yunbook=>{
                                        return (
                                            <Col key={yunbook.bid} span={8}>
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
                                        defaultPageSize = {mylist.limit}
                                        onChange = {(page)=>changeHandler(page,list.limit,uid)}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
                        :
                        <Form
                            horizontal 
                            className = 'form'
                            form = { form }
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
                                            max:20,
                                            message:'请输入少于20字的名称'
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
                                 <AreaCascader
                                    {...getFieldProps('aid',{
                                        rules:[{
                                            required:true,
                                            type:'array',
                                            message:'请选择分类'
                                        }]
                                    })}
                                    level = { 4 }   
                                    initialOptions = {
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
                            <Button onClick={this.onClick}>   
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
        handleNew:(section)=>{
            dispatch({
                type:'section/new',
                payload:{
                    ...section
                }
            })
        }
    })
)(Form.create()(New))