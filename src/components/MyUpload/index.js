import React,{Component} from 'react'
import { Upload, Button, Icon } from 'antd'

class MyUpload extends Component {
  state = {
      fileList:[]
  }
  normFile(e) {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
  }
  handleChange = (info)=> {
    let fileList = info.fileList

    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    fileList = fileList.slice(-1)

    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file) => {
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.cover
      }
      return file
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.code === 200
      }
      return true
    })

    this.setState({ fileList })
  }
  render(){
    const {
        getFieldProps,//eslint-disable-line
        ...props
    } =  this.props
    return (
      <Upload 
        {...props} 
        {...getFieldProps('logo',{
          
        })}
        fileList={this.state.fileList}
        onChange = {this.handleChange}
      >
        <Button type="ghost">
          <Icon type="upload" /> 点击上传
        </Button>
      </Upload>
    )
  }
}

export default MyUpload

