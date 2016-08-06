import React,{ Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs,Button,Form,Input,message, Spin, Cascader } from 'antd'
import EditLblView from './EditLblView.js'
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
        loading: PropTypes.bool
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.yunbook){
            this.setState({
                lbl:nextProps.yunbook.lbl
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
                            if(item.id===area.id){
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
        const isLeaf = 6 === targetOption.zoom
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
                area_id:values.area_ids[3],
                title:values.title,
                descript:values.descript,
                id:this.props.yunbook.id,
                money: values.money
            }
            this.props.save(params)
        })
    }
    render(){
        const {
            form,yunbook, loading
        } = this.props
        const {
            options,defaultValue
        } = this.state
        const {getFieldProps}=form
        const aidProps = getFieldProps('area_ids',{
                rules:[{
                    required:true,
                    type:'array',
                    message:'请选择分类'
                }],
                initialValue: defaultValue
            })
        delete aidProps.value  
        return(
            <div>
                <Spin spinning = { loading }>
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
                                label = '售价'
                                {...formItemLayout}
                            >
                                <Input
                                    type = 'number'
                                    addonAfter = '元'
                                    {...getFieldProps('money',{
                                        rules:[{
                                            required: true,
                                            message: '请设置售价'
                                        }],
                                        initialValue:yunbook&&yunbook.money
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='分类'
                                {...formItemLayout}
                            > 
                            { defaultValue.length === 4?
                                <Cascader
                                    placeholder='请选择分类'
                                    options = {options}
                                    loadData = {this.loadData}
                                    defaultValue={defaultValue}
                                    {...aidProps}
                                />:null}
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
                <Button style={{marginTop:20}} type='primary' onClick={()=>{
                        const submit = document.getElementById('_submit_')
                        if(!submit){
                            this.props.save({
                                lbl:this.state.lbl,
                                id:this.props.yunbook.id
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
    state=>({
        yunbook:state.yunbook.entity,
        loading: state.yunbook.loading
    }),
    dispatch=>({
        save:(params)=>{
            dispatch({
                type:'yunbook/edit',
                payload:params
            })
        }
    })
)(Form.create()(Edit))