import React,{ Component,PropTypes } from 'react'
import {Button,Modal} from 'antd'
import { connect } from 'react-redux'
import './TeamList.css'

class TeamList extends Component{
    static propTypes = {
        list:PropTypes.array,
        visible:PropTypes.bool,
        onCancel:PropTypes.func,
        remove:PropTypes.func
    }
    render(){
        const {
            list,visible,onCancel,remove
        } = this.props
        return(
            <Modal
                footer ={null}
                visible = {visible}
                onCancel = {onCancel}
            >
            {
                list.filter(item=>item.type===1).map(item=>{
                    return(<div key={item.id} className='titem'>
                            <div className='tdivimg'>                        
                        {
                            item.user&&item.user.face?
                            <img 
                                src={item.user.face} 
                                width='100%'
                                className='timg'
                            />:null
                        }
                        </div>
                        <span className='tspan'>
                            {item.user&&(item.user.cname||item.user.mobile)}
                        </span>
                        <Button 
                            className='tbutton'
                            onClick = {()=>remove(item.id)}
                        >
                            踢除
                        </Button>
                    </div>)
                })
            }
            </Modal>
        )
    }
}

export default connect(
    state=>({
        list:state.lessonTeam.list
    }),
    dispatch=>({
        remove:(id)=>{
            dispatch({
                type:'lessonTeam/delete',
                payload:{
                    id
                }
            })
        }
    })
)(TeamList)