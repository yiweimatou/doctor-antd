import React, {Component, PropTypes} from 'react';
import { Upload, Icon, Button, message } from 'antd'
import { UPLOAD_COVER_API } from '../../constants/api'

class ImgUploader extends Component {
    state = {
        fileList: []
    }
    componentWillMount() {
        const { fileList } = this.props
        this.setState({ fileList })
    }
    changeHandler = info => {
        let fileList = info.fileList
        fileList = fileList.slice(-1)
        fileList = fileList.map((file) => {    
            if (file.response) {
                file.url = file.response.cover
            }   
            return file            
        })
        fileList = fileList.filter(file => {
            if (file.response) {
                if (file.response.code === 200) {
                    return true
                } else {
                    message.error(file.response.msg ? file.response.msg : '服务器未响应，请稍后再试', 6)
                    return false
                }
            }
            return true
        })
        this.setState({ fileList })
        if (info.file.status === 'error') {
            return message.error('服务器未响应，请稍后再试', 6)
        }
    }
    getValue = () => this.state.fileList[0]
    render() {
        return (
            <Upload 
                name = 'upload_file' 
                action = {UPLOAD_COVER_API}
                listType = 'picture' 
                fileList = {this.state.fileList}
                onChange = {this.changeHandler}
            >
                <Button type = 'ghost'>
                    <Icon type = 'upload'/>点击上传图片
                </Button>
            </Upload>
        );
    }
}

ImgUploader.propTypes = {
    fileList: PropTypes.array
};

export default ImgUploader;