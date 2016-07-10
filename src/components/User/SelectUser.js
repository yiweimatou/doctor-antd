import React,{ Component,PropTypes } from 'react'
import SearchInput from '../SearchInput'
import {Button,Modal} from 'antd'
import { connect } from 'react-redux'
import './SelectUser.css'

class SelectUser extends Component {
    static propTypes = {
        list:PropTypes.array,
        invite:PropTypes.func.isRequired,
        search:PropTypes.func.isRequired,
        lid:PropTypes.number,
        visible:PropTypes.bool,
        onCancel:PropTypes.func
    }
    render(){
        const {
            list,invite,lid,search,visible,onCancel
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
                                <div key={item.uid} className='sitem'>
                                        <div className='sdivImg'>
                                        {
                                            item.face?
                                        <img 
                                            src={item.face}
                                            className='simg'
                                            width='100%'
                                        />:null
                                        }
                                        </div>
                                    <span>{item.cname||item.mobile}</span>
                                    <Button 
                                        className='sbutton'
                                        onClick = {
                                            ()=>invite(item.mobile,lid)
                                        }
                                    >
                                        邀请
                                    </Button>
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
        list:state.user.list,
        lid:state.lesson.entity.lid
    }),
    dispatch=>({
        search:mobile=>dispatch({
            type:'user/list',
            payload:{
                mobile
            }
        }),
        invite:(mobile,lid)=>dispatch({
            type:'lessonTeam/new',
            payload:{
                mobile,lid
            }
        })
    })
)(SelectUser)