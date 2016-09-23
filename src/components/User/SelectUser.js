import React,{ Component,PropTypes } from 'react'
import SearchInput from '../SearchInput'
import { Button, Modal, message} from 'antd'
import { connect } from 'react-redux'
import './SelectUser.css'
import { DEFAULT_FACE } from '../../constants/api'

class SelectUser extends Component {
    static propTypes = {
        list:PropTypes.array,
        invite:PropTypes.func.isRequired,
        search:PropTypes.func.isRequired,
        visible:PropTypes.bool,
        onCancel:PropTypes.func,
        lid: PropTypes.string.isRequired
    }
    inviteHandler = params => {
      this.props.invite(params, () => message.success('邀请已经发送'), error => message.error(error))
    }
    render(){
        const {
            list, lid, search, visible, onCancel
        } = this.props
        return(
            <Modal
                footer = {null}
                visible = {visible}
                onCancel = {onCancel}
            >
                <div className='main'>
                    <SearchInput
                        onSearch = { (mobile)=>search(mobile) }
                        placeholder = '请输入手机号码搜索'
                    />
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
                                    <span style = {{display:'block',width:50,textAlign:'center'}}>{item.cname||item.mobile}</span>
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
        search:mobile=>dispatch({
            type:'user/list',
            payload:{
                mobile
            }
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
