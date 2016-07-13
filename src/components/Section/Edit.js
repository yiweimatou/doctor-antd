import React,{ Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs,Button,Form,Input,message,Switch,Cascader } from 'antd'
import EditLblView from '../Yunbook/EditLblView.js'
import {
    getArea,
    getAreaList
} from '../../services/area.js'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class Edit extends Component{
    state = {
        lbl:'',
        options:[],
        defaultValue:[]
    }
    static propTypes = {
        yunbook:PropTypes.object,
        save:PropTypes.func,
        form:PropTypes.object,
        section:PropTypes.object,
        getYunbook:PropTypes.func
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.section&&nextProps.section){
            this.props.getYunbook(nextProps.section.bid)
            this.setState({
                lbl:nextProps.section.lbl
            })
        }
        if(!this.props.yunbook&&nextProps.yunbook){
            let a1=[],a2=[],a3=[],a4=[]
            getArea({
                aid:nextProps.yunbook.aid
            }).then(data=>data.get).then(area=>{
                this.setState({
                    defaultValue:[area.pid,area.aid]
                })
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        a4.push({
                            value:item.aid,
                            label:item.title,
                            zoom:item.zoom,
                            isLeaf:true
                        })
                    })
                })
                return area
            }).then(area=>{
                return getArea({
                    aid:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.aid===area.aid){
                            a3.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                children:a4
                            })
                        }else{
                            a3.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                isLeaf:false
                            })
                        }
                    })
                })
                this.setState({
                    defaultValue:[area.pid].concat(this.state.defaultValue)
                })
                return area
            }).then(area=>{
                return getArea({
                    aid:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.aid===area.aid){
                            a2.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                children:a3
                            })
                        }else{
                            a2.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                isLeaf:false
                            })
                        }
                    })
                })
                this.setState({
                    defaultValue:[area.pid].concat(this.state.defaultValue)
                })
                return area
            }).then(area=>{
                return getArea({
                    aid:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                    getAreaList({
                        pid:area.pid,
                        zoom:area.zoom,
                        limit:30
                    }).then(data=>{
                        data.list.forEach(item=>{
                            if(item.aid===area.aid){
                                a1.push({
                                    value:item.aid,
                                    label:item.title,
                                    zoom:item.zoom,
                                    children:a2
                                })
                            }else{
                                a1.push({
                                    value:item.aid,
                                    label:item.title,
                                    zoom:item.zoom,
                                    isLeaf:false
                                })
                            }
                        })
                        this.setState({
                            options:a1
                        })
                    })
            }).catch(error=>{
                message.error(error)
            })
        }
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = 6 ===targetOption.zoom
        targetOption.loading=true
        getAreaList({
            limit:30,
            pid:targetOption.value,
            zoom:targetOption.zoom+1
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.aid,
                        zoom:item.zoom,
                        isLeaf
                    }
                })
            }else{
                targetOption.children = []
            }
            this.setState({
                options:[...this.state.options]
            })
        }).catch(error=>{
            message.error(error)
        })   
    }
    changeLbl=lbl=>this.setState({lbl})

    submitHandler=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            const params = {
                lbl:this.state.lbl,
                aid:values.aid[3],
                title:values.title,
                descript:values.descript,
                status:values.status?2:1,
                sid:this.props.section.sid
            }
            this.props.save(params)
        })
    }
    render(){
        const {
            form,yunbook
        } = this.props
        const {
            options,defaultValue
        } = this.state
        const {getFieldProps}=form
        const aidProps = getFieldProps('aid',{
                rules:[{
                    required:true,
                    type:'array',
                    message:'请选择分类'
                }],
                initialValue:defaultValue
            })
        delete aidProps.value  
        return(
            <div>
                <Tabs defaultActiveKey='2'>
                    <TabPane key='1' tab='基本信息修改'>
                        <Form
                            horizontal 
                            form = { form }
                            onSubmit = { this.submitHandler }
                            style = {{pading:30,margin:'30 0'}}
                        >
                             <FormItem
                                {...formItemLayout}
                                label='云板书标题'
                                hasFeedback
                            >
                                <Input
                                    type='text'
                                    {...getFieldProps('title',{
                                        rules:[{
                                            required:true,
                                            max:30,
                                            message:'请填写最多30字标题'
                                        }],
                                        initialValue:yunbook&&yunbook.title
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='分类'
                                {...formItemLayout}
                            >
                                <Cascader
                                    placeholder='请选择分类'
                                    options = {options}
                                    loadData = {this.loadData}
                                    defaultValue={defaultValue}
                                    {...aidProps}
                                />
                            </FormItem>
                            <FormItem
                                label='课程简介'
                                {...formItemLayout}
                            >
                                <Input
                                    type='textarea'
                                    rows = '3'
                                    {...getFieldProps('descript',{
                                        rules:[{
                                            required:false,
                                            max:300,
                                            message:'最多300字'
                                        }],
                                        initialValue:yunbook&&yunbook.descript
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='是否公开'
                                {...formItemLayout}
                            >   
                                <Switch                   
                                    {...getFieldProps('status',{
                                        valuePropName:'checked',
                                        initialValue:yunbook&&yunbook.status===2
                                    })}
                                />
                            </FormItem>
                            <button type='submit' id='_submit_'></button>
                        </Form>
                    </TabPane>
                    <TabPane key='2' tab='标注修改'>
                        <EditLblView 
                            yunbook={this.props.yunbook}
                            changeLbl={this.changeLbl}
                        />
                    </TabPane>
                </Tabs>
                <Button style={{marginTop:20}} type='primary' onClick={()=>document.getElementById('_submit_').click()}>
                        保存
                </Button>
            </div>
        )
    }
}

export default connect(
    state=>({
        section:state.section.entity,
        yunbook:state.yunbook.entity
    }),
    dispatch=>({
        save:(params)=>{
            dispatch({
                type:'section/edit',
                payload:params
            })
        },
        getYunbook:(bid)=>{
            dispatch({
                type:'yunbook/get',
                payload:{
                    bid
                }
            })
        }
    })
)(Form.create()(Edit))