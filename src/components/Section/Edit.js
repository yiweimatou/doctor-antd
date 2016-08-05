import React,{ Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs,Button,Form,Input,message,Cascader } from 'antd'
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
        defaultValue:[],
        yunbook:null
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
            this.props.getYunbook(nextProps.section.book_id)
            this.setState({
                lbl:nextProps.section.lbl
            })
        }
        if(!this.props.yunbook&&nextProps.yunbook){
            this.setState({
                yunbook:{
                    ...nextProps.yunbook,
                    lbl:this.state.lbl                    
                }
            })
            let a1=[],a2=[],a3=[],a4=[]
            getArea({
                id:nextProps.yunbook.area_id
            }).then(data=>data.get).then(area=>{
                this.setState({
                    defaultValue:[area.pid,area.id]
                })
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        a4.push({
                            value:item.id,
                            label:item.title,
                            zoom:item.zoom,
                            isLeaf:true
                        })
                    })
                })
                return area
            }).then(area=>{
                return getArea({
                    id:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.id===area.id){
                            a3.push({
                                value:item.id,
                                label:item.title,
                                zoom:item.zoom,
                                children:a4
                            })
                        }else{
                            a3.push({
                                value:item.id,
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
                    id:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.id===area.id){
                            a2.push({
                                value:item.id,
                                label:item.title,
                                zoom:item.zoom,
                                children:a3
                            })
                        }else{
                            a2.push({
                                value:item.id,
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
                    id:area.pid
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
                                    value:item.id,
                                    label:item.title,
                                    zoom:item.zoom,
                                    children:a2
                                })
                            }else{
                                a1.push({
                                    value:item.id,
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
                        value:item.id,
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
                area_id:values.aid[3],
                title:values.title,
                descript:values.descript,
                id:this.props.section.id
            }
            this.props.save(params)
        })
    }
    click = (e)=>{
        e.preventDefault()
        const submit = document.getElementById('_submit')
        if(submit){
            submit.click()
        }else{
            this.props.save({
                lbl:this.state.lbl,
                sid:this.props.section.id
            })
        }
    }
    render(){
        const {
            form,section
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
                                label='标题'
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
                                        initialValue:section&&section.title
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
                                        initialValue:section&&section.descript
                                    })}
                                />
                            </FormItem>
                            <button type='submit' id='_submit'></button>
                        </Form>
                    </TabPane>
                    <TabPane key='2' tab='标注修改'>
                        <EditLblView 
                            yunbook={this.state.yunbook}
                            changeLbl={this.changeLbl}
                        />
                    </TabPane>
                </Tabs>
                <Button style={{marginTop:20}} type='primary' onClick={this.click}>
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
        getYunbook:(id)=>{
            dispatch({
                type:'yunbook/get',
                payload:{
                    id
                }
            })
        }
    })
)(Form.create()(Edit))