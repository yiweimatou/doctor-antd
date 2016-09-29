import React,{ Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs,Button,Form,Input,message,Cascader,Spin } from 'antd'
import EditLblView from '../Yunbook/EditLblView.js'
import {
    getArea,
    getAreaList
} from '../../services/area.js'
import {
    getLesson
} from '../../services/lesson'
import array from 'lodash/array'

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
        yunbook:null,
        loading: true
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
            let merge_id, _defaultValue
            Promise.all([getArea({
                id: nextProps.section.area_id
            }),getLesson({ id: nextProps.section.lesson_id })])
            .then(values => {
                const area = values[0].get
                merge_id = area.merge_id.split(',').map(i => parseInt(i, 10))
                const _index = merge_id.indexOf(values[1].get.area_id)
                _defaultValue = merge_id.slice(_index,merge_id.length - 1)
                merge_id = merge_id.slice(_index+1,merge_id.length)
                return Promise.all([getAreaList({ pid_list: _defaultValue.join(','), limit: 1000 }), area])
            }).then(([areas, area]) => {
                const _array = []
                _defaultValue.forEach(item => {
                    _array.push(areas.list.filter(area=> {
                        if(area.pid === item) {
                            return true
                        }
                    }).map(area => {
                        return {
                            label: area.title,
                            value: area.id,
                            zoom: area.zoom,
                            isLeaf: false,
                            pid: area.pid
                        }
                    }))
                })
                let areaList = _array.pop()
                let _list = _array.pop()
                while(_list !== undefined){
                    const _idx = array.findIndex(_list, { value: areaList[0].pid })
                    if(_idx === -1) break;
                    _list[_idx].children = areaList
                    areaList = _list
                    _list = _array.pop()
                }
                this.setState({
                    defaultValue: [area.id].concat(merge_id),
                    options: [{value: area.id, label: area.title, children: areaList }],
                    loading: false
                })
            })
            .catch(error=>{
                message.error(error)
            })
        }
        if(!this.props.yunbook&&nextProps.yunbook){
            this.setState({
                yunbook:{
                    ...nextProps.yunbook,
                    lbl:this.state.lbl
                }
            })
        }
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = 6 ===targetOption.zoom
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
                lbl: encodeURIComponent(this.state.lbl),
                area_id: values.area_ids[values.area_ids.length-1],
                title: values.title,
                descript: values.descript,
                id: this.props.section.id
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
                lbl: encodeURIComponent(this.state.lbl),
                id: this.props.section.id
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
        const {getFieldDecorator}=form
        return(
            <div>
                <Spin spinning = { this.state.loading }>
                <Tabs defaultActiveKey='2'>
                    <TabPane key='1' tab='基本信息修改'>
                        <Form
                            horizontal
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
                                    {...getFieldDecorator('title',{
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
                                    changeOnSelect = { true }
                                    placeholder='请选择分类'
                                    options = {options}
                                    loadData = {this.loadData}
                                    {...getFieldDecorator('area_ids',{
                                        rules:[{
                                            required:true,
                                            type:'array',
                                            message:'请选择分类'
                                        }],
                                        initialValue:defaultValue
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='课程简介'
                                {...formItemLayout}
                            >
                                <Input
                                    type='textarea'
                                    rows = '3'
                                    {...getFieldDecorator('descript',{
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
                <Button style={{top:0,padding: '4px 20px 5px 20px',position:'absolute',right:23}} type='primary' onClick={this.click}>
                        保存
                </Button>
                </Spin>
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
