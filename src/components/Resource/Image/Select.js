import React, {Component, PropTypes} from 'react';
import { Table, message, Upload, Button } from 'antd'
import { add, list, info }from '../../../services/source'
import { UPLOAD_IMG_API, IMAGE} from '../../../constants/api'

class ImageSelect extends Component {
    state = {
        loading: true,
        total: 0,
        list: []
    }
    componentWillMount() {
        info({state: 1, category_id: IMAGE}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 3,
            offset,
            category_id: IMAGE
        }).then(data => {
            this.setState({
                loading: false,
                list: data.list
            })
        }).catch(error => message.error(error))
    }
    changeHandler = info => {
        if (info.file.status === 'uploading' && this.state.loading === false) {
            this.setState({ loading: true })
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 200) {
                const params = { 
                    title: info.file.name.split('.')[0], 
                    category_id: IMAGE,
                    state: 1,
                    path: info.file.response.img
                }
                add(params).then(() => {
                    this.setState({
                        list: this.state.list.concat(params),
                        loading: false
                    })
                }).catch(error => {
                    message.error(error),
                    this.setState({ loading: false })
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(`文件上传出错: ${info.file.response.msg}`)
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败!`)
            this.setState({ loading: false })
        }
    }
    render() {
        const { total, loading, list } = this.state
        const { onChange } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            total: total,
            onChange: offset => this._getList(offset)
        }
        const columns = [{
            title: '名称',
            key: 'title',
            dataIndex: 'title'
        }, {
            title: '图片',
            key: 'path',
            dataIndex: 'path',
            render: path => (<img src={path} width='100' height='80'/>)
        }]
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => onChange(selectedRows[0])
        }
        return (
            <div>
                <Upload
                    name = 'upload_file'
                    action = {UPLOAD_IMG_API}
                    showUploadList = {false}
                    accept = 'image/jpeg, image/png'
                    onChange = {this.changeHandler}
                    beforeUpload = {file => {
                      const fiveM = 5*1024*1024
                      const isToobig = file.size > fiveM
                      if (isToobig) {
                          message.error('只允许上传不大于5M的图片!')
                      }
                      return !isToobig
                  }}
                >
                    <Button style={{ marginBottom: 10 }} type="primary">上传</Button>
                </Upload>
                <Table dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection}/>
            </div>
        );
    }
}

ImageSelect.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default ImageSelect
