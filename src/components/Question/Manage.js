import React, {Component} from 'react';
import List from './List'
import Add from './Add'
import { Tabs, Spin, Icon, message, Modal } from 'antd'
import { connect } from 'react-redux'
import Category from '../Category'
import { TOPIC } from '../../constants/api'
const TabPane = Tabs.TabPane

class Manage extends Component {
    state = {
        activeKey: '1',
        uploading: false,
        success: 0,
        failure: 0,
        total: 0
    }
    componentWillMount() {
      if (!window.XLSX) {
        const head= document.getElementsByTagName('head')[0]
        const script= document.createElement('script')
        script.type= 'text/javascript'
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.core.min.js'
        head.appendChild(script)
      }
    }
    changeHandler = info => {
      let fileList =  info.fileList
      //上传列表数量的限制
      fileList = fileList.slice(-1)
      // 2. 读取远程路径并显示链接
      fileList = fileList.map((file) => {
        if (file.response) {
          // 组件会将 file.url 作为链接进行展示
          file.url = file.response.cover;
        }
        return file;
      })
      // 3. 按照服务器返回信息筛选成功上传的文件
      fileList = fileList.filter((file) => {
        if (file.response) {
          return file.response.code === 200
        }
        return true;
      })
      this.setState({ fileList })
    }
    clickHandler = () => {
      document.getElementById('file').click()
    }
    tick = () => {
      if(this.state.success + this.state.failure === this.state.total) {
        clearInterval(this.interval)
        this.setState({ uploading: false })
        Modal.info({ content: `上传:${this.state.total},成功:${this.state.success}`})
      }
    }
    fileChangeHandler = (e) => {
      this.setState({ uploading: true })
      e.preventDefault()
      const category = this.refs.select.refs.category.state.value
      if (category.length > 0 && category.length < 3) {
          return message.error('请再选择一级分类')
      }
      const files  = e.target.files
      const ext = files[0].name.split('.').slice(-1)[0].toUpperCase()
      if (ext !== 'XLS' && ext !== 'XLSX') {
          this.setState({ uploading: false })
          return message.error('请上传EXCLE', 8)
      }
      let reader = new FileReader()
      reader.onerror = () => {
        message.error('文件读取错误!', 6)
      }
      reader.onload = e => {
        const data = e.target.result
        if (!window.XLSX) {
          return message.error('缺少组件，请刷新页面!', 8)
        }
        const workbook = window.XLSX.read(data, {type: 'binary'})
        const first_sheet_name = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[first_sheet_name]
        const _json = window.XLSX.utils.sheet_to_json(worksheet)
        this.setState({ total: _json.length })
        this.interval = setInterval(this.tick, 1000)
        _json.forEach(item => {
          if (item['标准答案'] === '') return
          this.props.add({
            state: 1,
            question: item['试题题目（标题）'],
            option1: item['备选A'] || '',
            option2: item['备选B'] || '',
            option3: item['备选C'] || '',
            option4: item['备选D'] || '',
            option5: item['备选E'] || '',
            answer: item['标准答案']
          }, topic => {
            if (category.length >= 3) {
            this.props.grow({
                lat: this.refs.select.getLatLng().lat,
                lng: this.refs.select.getLatLng().lng,
                title: topic.question,
                state: 1,
                category_id: TOPIC,
                foreign_id: topic.id,
                // cover: cover,
                map_id: 1,
                kind: category[0].id === '1' ? category[1] : category[2]
            }, null, error => message.error(error))
          }
            this.setState({ success: this.state.success + 1 })
          }, () => {
            this.setState({ failure: this.state.failure + 1 })
          })
        })
      }
      reader.readAsBinaryString(files[0])
    }
    render() {
        const { activeKey } = this.state
        return (
           <Tabs defaultActiveKey='1' activeKey={activeKey} onTabClick={
               activeKey => this.setState({ activeKey })
           }>
                <TabPane tab='试题列表' key='1'>
                    <List />
                </TabPane>
                <TabPane tab='新建试题' key='2'>
                    <Add afterAddHandler={() => this.setState({ activeKey: '1' })} add={this.props.add} getList={this.props.getList} grow={this.props.grow}/>
                </TabPane>
                <TabPane tab='批量上传' key='3'>
                    <Spin spinning={this.state.uploading}>
                      <div style = {{textAlign: 'center'}} >
                        <div style={{ display: 'inline-block', width: '600px', marginBottom: 20}}>
                          <span>试卷分类:&nbsp;</span>
                          <Category getList={this.props.getList} style={{width: '500px'}} ref='select'/>
                        </div>
                        <p >请根据模板格式填写Excel &nbsp;
                            <a href = "http://7xp3s1.com1.z0.glb.clouddn.com/%E9%A2%98%E5%BA%93%E6%A8%A1%E6%9D%BF.xlsx" target = '_blank'>
                                下载Excel模板
                            </a>
                        </p>
                        <a onClick={this.clickHandler} style={{display:'inline-block', width:244, height:138, lineHeight: 10, borderStyle: 'dashed'}}>
                          <Icon type="plus" style={{fontSize:'300%'}}/>
                          <input id="file" onChange={this.fileChangeHandler} type="file" style={{width:0,height:0}}/>
                        </a>
                      </div>
                    </Spin>
                </TabPane>
           </Tabs>
        );
    }
}
export default connect(
    null,
    dispatch => ({
        add: (params, resolve, reject) => {
            dispatch({
              type: 'topic/add',
              payload: {
                  params, resolve, reject
              }
            })
        },
        getList(params, resolve, reject) {
            dispatch({
                type: 'category/list',
                payload: { params, resolve, reject }
            })
        },
        grow(params, resolve, reject) {
          dispatch({
            type: 'grow/add',
            payload: { params, resolve, reject }
          })
        }
    })
)(Manage);