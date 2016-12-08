import React,{ Component,PropTypes } from 'react'
import { Button, Modal, message, Input, Col, Pagination } from 'antd'
import { connect } from 'react-redux'
import './SelectUser.css'
import { DEFAULT_FACE } from '../../constants/api'
import { info } from '../../services/user'

class SelectUser extends Component {
    state = {
        value: '',
        total: 0
    }
    static propTypes = {
        list: PropTypes.array,
        invite: PropTypes.func.isRequired,
        search: PropTypes.func.isRequired,
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        lid: PropTypes.string.isRequired
    }
    
    componentWillMount() {
        this.infoHandler()
    }

    infoHandler = () => {
        info({ mobile: this.state.value }).then((data) => {
            this.setState({ total: data.count })
            if (data.count ===0){
                this.setState({ loading: false })
            } else {
                this.props.search({
                    mobile: this.state.value,
                    offset: 1,
                    limit: 6
                })
            }
        })
    }
    
    inviteHandler = params => {
      this.props.invite(params, () => message.success('成功邀请'), error => message.error(error))
    }
    render(){
        const {
            list, lid, search, visible, onCancel
        } = this.props
        const { total, value } = this.state
        return(
            <Modal
                footer = {null}
                visible = {visible}
                onCancel = {onCancel}
            >
                <div className='main'>
                    <Input.Group>
                        <Col span={12}>
                            <Input value={this.state.value} onChange={e => this.setState({ value: e.target.value })}/>
                        </Col>
                        <Col span={12}>
                            <Button onClick={this.infoHandler}>搜索</Button> 
                        </Col>
                    </Input.Group>
                    <div className='main'>
                    {
                        list.map(item=>{
                            return (
                                <div key={item.id} className='sitem'>
                                        <div className='sdivImg'>
                                          <img
                                              src={item.face || DEFAULT_FACE}
                                              className='simg'
                                              width='100%'
                                          />
                                        </div>
                                    <span className='sdiv'>{item.cname||item.mobile}</span>
                                    <Button
                                        className='sbutton'
                                        onClick = {
                                          () => this.inviteHandler({
                                            lesson_id: lid,
                                            account_id: item.id
                                          })
                                        }
                                    >邀请</Button>
                                </div>
                            )
                        })
                    }
                    <Pagination total={total} showTotal={total => `共${total}条`} pageSize={6} onChange={offset => search({ limit: 6, offset, mobile: value })}/>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default connect(
    state=>({
        list:state.user.list
    }),
    dispatch=>({
        search: params => dispatch({
            type:'user/list',
            payload: params
        }),
        invite: (params, resolve, reject) =>
          dispatch({
            type:'lesson_team/add',
            payload:{
                params, resolve, reject
            }
        })
    })
)(SelectUser)
