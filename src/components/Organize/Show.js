import React,{ Component, PropTypes } from 'react'
import Paper from '../Paper'
import { Button, message, Spin, Upload, Input } from 'antd'
import { DEFAULT_COVER } from '../../constants/api'
import OrganizeBar from './organize_bar'
import { UPLOAD_LOGO_API } from '../../constants/api'
import { Link } from 'react-router'

class Show extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editable: false,
      descript: '',
      uploading: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.organize.descript !== nextProps.organize.descript) {
      this.setState({ descript: nextProps.organize.descript })
    }
  }
  changeHandler = info => {
    if (info.file.status === 'uploading' && this.state.uploading === false) {
      this.setState({ uploading: true })
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        this.props.edit({
          id: this.props.organize.id,
          logo: info.file.response.logo
        }, () => {
          message.success('更换封面成功!')
          this.setState({ uploading: false })
        }, error => {
          message.error(error)
          this.setState({ uploading: false })
        })
      } else {
        this.setState({
          uploading: false
        })
        message.error(`文件上传出错: ${info.file.response.msg}`)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败!`);
      this.setState({ uploading: false })
    }
  }
  okHandler = () => {
    this.props.edit({
      descript: this.state.descript,
      id: this.props.organize.id
    },() => {
      message.success('修改成功!')
      this.setState({ editable: false })
    }, error => message.error(error))
  }
  cancelHandler = () => {
    this.setState({
      editable: false,
      descript: this.props.organize.descript
    })
  }
  render(){
    const { organize, loading } = this.props
    const { editable, descript, uploading } = this.state
    const money = organize.balance_amount && organize.balance_amount / 100 || 0
    return(
      <Spin spinning={loading}>
        <div>
            <OrganizeBar selectedKey="show" organize={organize} />
        </div>
        <Paper>
            <div style={{ margin: '30px 20px 10px', padding: '20px 0 10px' }}>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>机构名称</span>
                <strong style={{ marginLeft: '30px' }}>{ organize.title }</strong>
                <span style={{ marginLeft: '30px' }}>(修改机构名称请拨打0571-88208250)</span>
                <div style={{ float: 'right' }}>
                  <span>粉丝数</span>
                  <span style={{ marginLeft: '20px'}}>{organize.fans}</span>
                  <span className="ant-divider" style={{ height: '10px' }}/>
                  <span>课程数</span>
                  <span style={{ marginLeft: '20px' }}>{organize.lessons}</span>
                </div>
              </div>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>机构余额</span>
                <span style={{ marginLeft: '30px', fontSize: '40px', color: 'orange' }}>{money}</span>元
                <div style={{ float: 'right', lineHeight: '60px' }}>
                  <Button type="primary">
                    <Link to={`/organize/recharge/${organize.id}`}>充值</Link>
                  </Button>
                  <Button style={{ marginLeft: '10px' }}>
                    <Link to={`/organize/bill/${organize.id}`}>交易明细</Link>
                  </Button>
                </div>
              </div>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>机构logo</span>
                <img style={{ marginLeft: '30px' }} src={ organize.logo || DEFAULT_COVER } width={100} height={100} />
                <div style={{ float: 'right', display: 'inline-block', lineHeight: '100px' }}>
                  <Upload
                    name = 'upload_file'
                    action = {UPLOAD_LOGO_API}
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
                    <Button loading={uploading}>修改封面</Button>
                  </Upload>
                </div>
              </div>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>机构简介</span>
                { editable ?
                  <div style={{ display: 'inline-block', marginLeft: '30px' }}>
                    <Input value={descript} type="textarea" rows={3} onChange={e => this.setState({ descript: e.target.value })}/>
                    <div style={{ marginTop: '10px' }}>
                      <Button onClick={this.okHandler} type="primary">确定</Button>
                      <Button onClick={this.cancelHandler} style={{ marginLeft: '10px' }}>取消</Button>
                    </div>
                  </div>
                  :
                  <span style={{ marginLeft: '30px' }}>{organize.descript}</span>
                }
                <div style={{ float: 'right' }}>
                  <Button onClick={() => this.setState({ editable: true })}>修改</Button>
                </div>
              </div>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>机构地址</span>
                <span style={{ marginLeft: '30px' }}>{organize.address}</span>
                <div style={{ float: 'right' }}>如需修改请拨打0571-88208250</div>
              </div>
              <div style={{ margin: '40px 0', padding: '20px 0', borderBottom: '2px solid #ddd' }}>
                <span>管理员</span>
                <span style={{ marginLeft: '30px' }}>{organize.admin}</span>
              </div>
            </div>
        </Paper>
      </Spin>
      )
    }
}

Show.propTypes = {
    organize: PropTypes.object.isRequired,
    edit: PropTypes.func.isRequired,
}

export default Show
