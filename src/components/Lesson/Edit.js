// import React,{ Component,PropTypes } from 'react'
// import { 
//     Form,
//     Button,
//     Input,
//     Upload,
//     Icon 
// } from 'antd'
// import Paper from '../Paper'
// import {UPLOAD_COVER_API} from '../../constants/api.js'
// import AreaCascader from '../AreaCascader'

// const FormItem = Form.Item
// const formItemLayout = {
//     labelCol: { span: 4 },
//     wrapperCol: { span: 12 },
// }

// class Edit extends Component{
//     static propTypes = {
//         form:PropTypes.object,
//         handleEdit:PropTypes.func.isRequired
//     }
//     state = {
//         fileList:[]
//     }
//     normFile(e) {
//         if (Array.isArray(e)) {
//             return e
//         }
//         return e && e.fileList
//     }
//     handleChange = (info)=> {
//         let fileList = info.fileList
//         fileList = fileList.slice(-1)
//         fileList = fileList.map((file) => {
//         if (file.response) {
//             file.url = file.response.cover
//         }
//         return file
//         })
//         fileList = fileList.filter((file) => {
//         if (file.response) {
//             return file.response.code === 200
//         }
//         return true
//         })
//         this.setState({ fileList })
//     }
//     submitHandler=(e)=>{
//         e.preventDefault()
//         this.props.form.validateFields((errors,values)=>{
//             if(errors){
//                 return
//             }
//             console.log(values)
//             return
//             // const params = {
//             //     lname:values.lname,
//             //     descript:values.descript,
//             //     aid:values.aid[values.aid.length-1],
//             //     cover:this.state.fileList[0].url
//             // }
//             // this.props.handleEdit(params)
//         })
//     }
//     render(){
//         const {
//             form
//         } = this.props
//         const { getFieldProps } = form
//         return(
//             <Paper>
//                 <Form 
//                     horizontal 
//                     className = 'form'
//                     form = { form }
//                     onSubmit = { this.submitHandler }
//                 >
//                     <FormItem
//                         {...formItemLayout}
//                         label='课程名'
//                         hasFeedback
//                         required
//                     >
//                         <Input
//                             type='text'
//                         />
//                     </FormItem>
//                     <FormItem
//                         {...formItemLayout}
//                         label = 'logo'
//                         required
//                     >
//                         <Upload
//                             name="upload_file" 
//                             action={UPLOAD_COVER_API}
//                             listType="picture"
//                             fileList={this.state.fileList}
//                             onChange = {this.handleChange}
//                         >
//                             <Button type="ghost">
//                                 <Icon type="upload" /> 点击上传
//                             </Button>
//                         </Upload>
//                     </FormItem>
//                     <FormItem
//                         label='分类'
//                         required
//                         {...formItemLayout}
//                     >
//                         <AreaCascader
//                             {...getFieldProps('aid')}
//                             level = { 3 }                         
//                         />
//                     </FormItem>
//                     <FormItem
//                         label='课程简介'
//                         {...formItemLayout}
//                     >
//                         <Input
//                             type='textarea'
//                             rows = '3'
//                         />
//                     </FormItem>
//                     <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
//                         <Button type="primary" htmlType="submit">保存</Button>
//                     </FormItem>
//                 </Form>
//             </Paper>
//         )
//     }
// }

// export default Edit