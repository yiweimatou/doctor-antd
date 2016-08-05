import React,{ Component,PropTypes } from 'react'
import SearchInput from '../SearchInput'
import {Button,Modal} from 'antd'
import { connect } from 'react-redux'
import './SelectUser.css'
import { IMG_URL } from '../../constants/api'

class SelectUser extends Component {
    static propTypes = {
        list:PropTypes.array,
        invite:PropTypes.func.isRequired,
        search:PropTypes.func.isRequired,
        lesson_id:PropTypes.number,
        visible:PropTypes.bool,
        onCancel:PropTypes.func
    }
    render(){
        const {
            list,invite,lesson_id,search,visible,onCancel
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
                                        {
                                            item.face?
                                        <img 
                                            src={IMG_URL+item.face}
                                            className='simg'
                                            width='100%'
                                        />:null
                                        }
                                        </div>
                                    <span style = {{display:'block',width:50,textAlign:'center'}}>{item.cname||item.mobile}</span>
                                    <Button 
                                        className='sbutton'
                                        onClick = {
                                            ()=>invite(item.mobile,lesson_id,item.id)
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
        lesson_id:state.lesson.entity&&state.lesson.entity.id
    }),
    dispatch=>({
        search:mobile=>dispatch({
            type:'user/list',
            payload:{
                mobile
            }
        }),
        invite:(mobile,lesson_id,account_id)=>dispatch({
            type:'lessonTeam/new',
            payload:{
                mobile,lesson_id,account_id
            }
        })
    })
)(SelectUser)