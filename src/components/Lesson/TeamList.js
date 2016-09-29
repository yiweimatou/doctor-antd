import React,{ Component, PropTypes } from 'react'
import { Button, Modal, message } from 'antd'
import { connect } from 'react-redux'
import { DEFAULT_FACE } from '../../constants/api'
import './TeamList.css'

class TeamList extends Component{
    state = {
      list: [],
    }
    static propTypes = {
        visible:PropTypes.bool,
        onCancel:PropTypes.func,
        remove:PropTypes.func
    }
    removeHandler = params => {
      this.props.remove(params, () => {
        message.success('操作成功!')
        this.setState({ list: this.state.list.filter(i => i.tid !== params.id) })
      }, error => message.error(error)
      )
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.list !== nextProps.list) {
        this.setState({ list: nextProps.list })
      }
    }
    render(){
        const { visible, onCancel } = this.props
        const { list } = this.state
        return(
            <Modal
                footer ={null}
                visible = {visible}
                onCancel = {onCancel}
            >
            {
                list.length > 0 ?
                list.map(item=>{
                    return(<div key={item.id} className='titem'>
                            <div className='tdivimg'>
                            <img
                                src={ item.face || DEFAULT_FACE }
                                width='100%'
                                className='timg'
                            />
                        </div>
                        <span className='tspan'>
                            {item.cname||item.mobile}
                        </span>
                        <Button
                            className='tbutton'
                            onClick = { () => this.removeHandler({ id: item.tid })}
                        >踢除</Button>
                    </div>)
                }):<div>没有数据</div>
            }
            </Modal>
        )
    }
}

export default connect(null,
    dispatch=>({
        getInfo: (params, resovle, reject) => {
          dispatch({
            type: 'lessonteam/info',
            payload: {
              params, resovle, reject
            }
          })
        },
        remove: (params, resolve, reject) => {
            dispatch({
                type:'lesson_team/delete',
                payload: {
                  params, resolve, reject
                }
            })
        }
    })
)(TeamList)
